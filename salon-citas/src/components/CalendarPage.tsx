import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { useAuth } from './AuthProvider';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  Timestamp
} from 'firebase/firestore';
import AppointmentForm from './AppointmentForm';
import AppointmentDetails from './AppointmentDetails';

interface AppointmentEvent {
  id: string;
  staff: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  start: string;
  end: string;
  bookedBy: string;
}

export default function CalendarPage() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);
  const [activeEvent, setActiveEvent] = useState<EventApi | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'appointments'));
    return onSnapshot(q, snap =>
      setEvents(
        snap.docs.map(d => {
          const data = d.data() as any;
          return {
            id: d.id,
            staff: data.staff,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            notes: data.notes,
            start: data.start.toDate().toISOString(),
            end: data.end.toDate().toISOString(),
            bookedBy: data.bookedBy
          };
        })
      )
    );
  }, []);

  const handleAdd = async (
    staff: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    start: Date,
    end: Date,
    notes: string
  ) => {
    if (!user) return;
    await addDoc(collection(db, 'appointments'), {
      staff,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      start: Timestamp.fromDate(start),
      end: Timestamp.fromDate(end),
      bookedBy: user.uid
    }).catch(() => alert('Error al crear cita'));
    setSelectInfo(null);
  };

  const handleUpdate = async (
    id: string,
    staff: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    start: Date,
    end: Date,
    notes: string
  ) => {
    await updateDoc(doc(db, 'appointments', id), {
      staff,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      start: Timestamp.fromDate(start),
      end: Timestamp.fromDate(end)
    }).catch(() => alert('Error al actualizar cita'));
    setActiveEvent(null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'appointments', id)).catch(() =>
      alert('Error al eliminar cita')
    );
    setActiveEvent(null);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-screen-lg mx-auto flex-1 flex flex-col">
        <header className="relative p-6 bg-center bg-cover rounded-t-xl flex justify-center items-center"
                style={{ backgroundImage: "url('/assets/fondo.png')" }}>
          <div className="absolute inset-0 bg-pink-100 opacity-80" />
          <img src="/assets/logo.png" alt="Logo" className="relative z-10 h-16 sm:h-24" />
          <button
            onClick={logout}
            className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-pink-700 z-10"
          >
            Cerrar sesión
          </button>
        </header>

        <div className="p-4 flex-1 overflow-auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            locale={esLocale}
            firstDay={1}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Agenda'
            }}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            height="auto"
            contentHeight="auto"
            selectable
            select={setSelectInfo}
            eventClick={({ event }) => setActiveEvent(event)}
            events={events.map(ev => ({
              id: ev.id,
              title:
                ev.staff + (ev.clientName ? ` — ${ev.clientName}` : ''),
              start: ev.start,
              end: ev.end,
              extendedProps: { ...ev },
              backgroundColor: '#FCE7F3',
              borderColor: '#F472B6',
              textColor: '#831843'
            }))}
          />
        </div>
      </div>

      {selectInfo && (
        <AppointmentForm
          selectInfo={selectInfo}
          onSave={handleAdd}
          onClose={() => setSelectInfo(null)}
        />
      )}
      {activeEvent && (
        <AppointmentDetails
          event={activeEvent}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </div>
  );
}
