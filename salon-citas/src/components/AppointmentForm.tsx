import React, { useEffect, useState } from 'react';
import { DateSelectArg } from '@fullcalendar/core';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface AppointmentFormProps {
  selectInfo: DateSelectArg;
  onSave: (
    staff: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    start: Date,
    end: Date,
    notes: string
  ) => Promise<void>;
  onClose: () => void;
}

interface AppointmentData {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectInfo,
  onSave,
  onClose
}) => {
  const toLocalInput = (d: Date) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0,16);
  };

  const [staff, setStaff] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [start, setStart] = useState(toLocalInput(selectInfo.start));
  const [end, setEnd]     = useState(toLocalInput(selectInfo.end));
  const [notes, setNotes] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [pastClients, setPastClients] = useState<AppointmentData[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const uSnap = await getDocs(collection(db, 'users'));
      const names = uSnap.docs.map(d => (d.data() as any).name);
      setUsers(names);
      if (names.length) setStaff(names[0]);

      const aSnap = await getDocs(collection(db, 'appointments'));
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
  }, []);

  useEffect(() => {
    const found = pastClients.find(c => c.clientName === clientName);
    if (found) {
      setClientEmail(found.clientEmail || '');
      setClientPhone(found.clientPhone || '');
    }
  }, [clientName, pastClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(
        staff,
        clientName,
        clientEmail,
        clientPhone,
        new Date(start),
        new Date(end),
        notes
      );
    } catch {
      alert('Error al guardar la cita.');
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 px-2 pt-20 sm:pt-0">
      <div className="bg-white rounded-lg w-full sm:w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold">Nueva cita</h2>

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
              placeholder="Nombre (opcional)"
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
              placeholder="Correo (opcional)"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Teléfono</span>
            <input
              type="tel"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Teléfono (opcional)"
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
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
