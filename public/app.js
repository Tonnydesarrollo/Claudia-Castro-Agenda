document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        selectable: true,
        editable: true,
        events: '/api/events',
        select: function(info) {
            var title = prompt('Nombre del cliente:');
            if (title) {
                var manicurist = prompt('Manicurista:');
                var phone = prompt('Teléfono del cliente:');
                var email = prompt('Correo del cliente:');
                fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        start: info.startStr,
                        end: info.endStr,
                        title: title,
                        manicurist: manicurist,
                        phone: phone,
                        email: email
                    })
                }).then(() => calendar.refetchEvents());
            }
            calendar.unselect();
        },
        eventClick: function(info) {
            if (confirm('¿Eliminar cita?')) {
                fetch('/api/events/' + info.event.id, {
                    method: 'DELETE'
                }).then(() => calendar.refetchEvents());
            }
        },
        eventResize: function(info) {
            updateEvent(info.event);
        },
        eventDrop: function(info) {
            updateEvent(info.event);
        }
    });
    calendar.render();

    function updateEvent(event) {
        fetch('/api/events/' + event.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start: event.start.toISOString(),
                end: event.end.toISOString(),
                title: event.title
            })
        }).then(() => calendar.refetchEvents());
    }
});
