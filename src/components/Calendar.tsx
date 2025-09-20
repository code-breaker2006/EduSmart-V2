import { useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventClickArg, EventContentArg } from '@fullcalendar/core'
import { toast } from 'react-toastify'

interface CalendarProps {
  events: any[]
  view?: string
  height?: string
  editable?: boolean
  onEventClick?: (event: any) => void
  onEventDrop?: (event: any) => void
}

export default function Calendar({ 
  events, 
  view = 'week', 
  height = '600px',
  editable = false,
  onEventClick,
  onEventDrop 
}: CalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  const getInitialView = () => {
    switch (view) {
      case 'day':
        return 'timeGridDay'
      case 'month':
        return 'dayGridMonth'
      default:
        return 'timeGridWeek'
    }
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event
    const props = event.extendedProps
    
    if (onEventClick) {
      onEventClick(event)
    } else {
      // Default event click behavior - show details
      toast.info(
        <div className="text-sm">
          <div className="font-semibold mb-2">{props.course_name}</div>
          <div className="space-y-1 text-xs">
            <div><strong>Faculty:</strong> {props.faculty}</div>
            <div><strong>Room:</strong> {props.room}</div>
            <div><strong>Type:</strong> {props.type}</div>
            <div><strong>Time:</strong> {event.start?.toLocaleTimeString()} - {event.end?.toLocaleTimeString()}</div>
          </div>
        </div>,
        {
          autoClose: 5000,
          closeOnClick: true
        }
      )
    }
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { event } = eventInfo
    const props = event.extendedProps
    
    return (
      <div className="p-1 h-full">
        <div className="font-semibold text-xs leading-tight mb-1">
          {event.title}
        </div>
        <div className="text-xs opacity-90 leading-tight">
          {props.room}
        </div>
        {props.faculty && (
          <div className="text-xs opacity-75 leading-tight truncate">
            {props.faculty}
          </div>
        )}
      </div>
    )
  }

  const handleEventDrop = (dropInfo: any) => {
    if (onEventDrop) {
      onEventDrop(dropInfo)
    } else {
      toast.success("Event moved successfully!")
    }
  }

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(getInitialView())
    }
  }, [view])

  return (
    <div className="w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={getInitialView()}
        height={height}
        events={events}
        editable={editable}
        droppable={editable}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        slotDuration="01:00:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday to Saturday
          startTime: '08:00',
          endTime: '18:00',
        }}
        slotEventOverlap={false}
        eventOverlap={false}
        expandRows={true}
        dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric' }}
        titleFormat={{ 
          year: 'numeric', 
          month: 'long',
          day: 'numeric'
        }}
        eventClassNames={(arg) => {
          const type = arg.event.extendedProps.type
          return type === 'lab' ? 'event-lab' : 'event-theory'
        }}
        eventDidMount={(info) => {
          // Add tooltip
          info.el.title = `${info.event.extendedProps.course_name}\n${info.event.extendedProps.faculty}\n${info.event.extendedProps.room}`
        }}
        nowIndicator={true}
        scrollTime="08:00:00"
        contentHeight="auto"
        aspectRatio={1.8}
        handleWindowResize={true}
        dayHeaderContent={(args) => {
          return (
            <div className="text-center">
              <div className="font-semibold">{args.text}</div>
              <div className="text-xs opacity-75">{args.date.getDate()}</div>
            </div>
          )
        }}
      />
    </div>
  )
}