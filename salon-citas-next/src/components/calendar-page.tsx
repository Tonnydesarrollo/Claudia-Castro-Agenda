"use client";

import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import type { DateSelectArg, EventApi } from "@fullcalendar/core";
import { useAuth } from "./auth-provider";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  Timestamp,
} from "firebase/firestore";
import AppointmentForm from "./appointment-form";
import AppointmentDetails from "./appointment-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X, Calendar as CalIcon, Clock, LogOut } from "lucide-react";

// 1) Define la forma que esperas de Firestore:
interface FirestoreAppointment {
  staff: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  start: { toDate(): Date };
  end: { toDate(): Date };
  bookedBy: string;
}

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [headerToolbar, setHeaderToolbar] = useState({
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  });
  const [initialView, setInitialView] = useState<
    | "dayGridMonth"
    | "timeGridWeek"
    | "timeGridDay"
    | "listWeek"
  >("timeGridWeek");

  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const q = query(collection(db, "appointments"));
    return onSnapshot(q, (snap) => {
      setEvents(
        snap.docs.map((d) => {
          // 2) Usa el tipo FirestoreAppointment, no 'any'
          const data = d.data() as FirestoreAppointment;

          return {
            id: d.id,
            staff: data.staff,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            notes: data.notes,
            start: data.start.toDate().toISOString(),
            end: data.end.toDate().toISOString(),
            bookedBy: data.bookedBy,
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setInitialView("listWeek");
        setHeaderToolbar({ left: "prev,next", center: "title", right: "today" });
      } else if (w < 1024) {
        setInitialView("timeGridDay");
        setHeaderToolbar({
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridDay,listWeek",
        });
      } else {
        setInitialView("timeGridWeek");
        setHeaderToolbar({
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        });
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
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
    await addDoc(collection(db, "appointments"), {
      staff,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      start: Timestamp.fromDate(start),
      end: Timestamp.fromDate(end),
      bookedBy: user.uid,
    }).catch(() => alert("Error al crear cita"));
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
    await updateDoc(doc(db, "appointments", id), {
      staff,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      start: Timestamp.fromDate(start),
      end: Timestamp.fromDate(end),
    }).catch(() => alert("Error al actualizar cita"));
    setActiveEvent(null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "appointments", id)).catch(() =>
      alert("Error al eliminar cita")
    );
    setActiveEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* … resto del JSX idéntico … */}
    </div>
  );
}
