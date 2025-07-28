import React, { useEffect, useState } from 'react';
import { EventApi } from '@fullcalendar/core';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Props {
  event: EventApi;
  onUpdate: (
    id: string,
    staff: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    start: Date,
    end: Date,
    notes: string
  ) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

interface AppointmentData {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

const AppointmentDetails: React.FC<Props> = ({
  event,
  onUpdate,
  onDelete,
  onClose
}) => {
  const toLocal = (d?: Date | null) => {
    if (!d) return '';
    const l = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return l.toISOString().slice(0,16);
  };

  const ep = event.extendedProps as any;
  const [staff, setStaff]             = useState(ep.staff as string);
  const [clientName, setClientName]   = useState(ep.clientName || '');
  const [clientEmail, setClientEmail] = useState(ep.clientEmail || '');
  const [clientPhone, setClientPhone] = useState(ep.clientPhone || '');
  const [start, setStart]             = useState(toLocal(event.start));
  const [end, setEnd]                 = useState(toLocal(event.end));
  const [notes, setNotes]             = useState(ep.notes || '');
  const [users, setUsers]             = useState<string[]>([]);
  const [pastClients, setPastClients] = useState<AppointmentData[]>([]);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    (async () => {
      const uSnap = await getDocs(collection(db,'users'));
      setUsers(uSnap.docs.map(d => (d.data() as any).name));

      const aSnap = await getDocs(collection(db,'appointments'));
      const seen = new Map<string, AppointmentData>();
      aSnap.docs.forEach(d => {
        const data = d.data() as any;
        if (data.clientName && !seen.has(data.clientName)) {
          seen.set(data.clientName, {
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone
          });
        }
      });
      setPastClients(Array.from(seen.values()));
    })();
  }, [event]);

  useEffect(() => {
    const found = pastClients.find(c => c.clientName === clientName);
    if (found) {
      setClientEmail(found.clientEmail || '');
      setClientPhone(found.clientPhone || '');
    }
  }, [clientName, pastClients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onUpdate(
      event.id,
      staff,
      clientName,
      clientEmail,
      clientPhone,
      new Date(start),
      new Date(end),
      notes
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 px-2 pt-20 sm:pt-0">
      <div className="bg-white rounded-lg w-full sm:w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold">Detalles de la cita</h2>

          <label className="block">
            <span className="text-gray-700">Manicurista</span>
            <select
              value={staff}
              onChange={e => setStaff(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Cliente</span>
            <input
              list="clients-list"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
            <datalist id="clients-list">
              {pastClients.map(c => (
                <option key={c.clientName} value={c.clientName} />
              ))}
            </datalist>
          </label>

          <label className="block">
            <span className="text-gray-700">Correo</span>
            <input
              type="email"
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Teléfono</span>
            <input
              type="tel"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Inicio</span>
            <input
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Fin</span>
            <input
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">Notas</span>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              rows={3}
            />
          </label>

          <div className="mt-auto flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => { onDelete(event.id); onClose(); }}
              disabled={saving}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {saving ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentDetails;
