"use client"

import type React from "react"
import { useState } from "react"
import type { EventApi } from "@fullcalendar/core"
import { X, Edit, Trash2, Calendar, Clock, User, Mail, Phone, FileText, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface AppointmentDetailsProps {
  event: EventApi
  onUpdate: (
    id: string,
    staff: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    start: Date,
    end: Date,
    notes: string,
  ) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export default function AppointmentDetails({ event, onUpdate, onDelete, onClose }: AppointmentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [staff, setStaff] = useState(event.extendedProps.staff || "")
  const [clientName, setClientName] = useState(event.extendedProps.clientName || "")
  const [clientEmail, setClientEmail] = useState(event.extendedProps.clientEmail || "")
  const [clientPhone, setClientPhone] = useState(event.extendedProps.clientPhone || "")
  const [notes, setNotes] = useState(event.extendedProps.notes || "")

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staff || !clientName) {
      alert("Por favor completa los campos obligatorios")
      return
    }
    onUpdate(event.id, staff, clientName, clientEmail, clientPhone, event.start!, event.end!, notes)
  }

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      onDelete(event.id)
    }
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-pink-600" />
            {isEditing ? "Editar Cita" : "Detalles de la Cita"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Date and Time Info */}
          <div className="bg-pink-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-medium">Horario:</span>
            </div>
            <div className="text-sm">
              <div>
                <strong>Inicio:</strong> {formatDateTime(event.start!)}
              </div>
              <div>
                <strong>Fin:</strong> {formatDateTime(event.end!)}
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Staff Selection */}
              <div className="space-y-2">
                <Label htmlFor="staff" className="text-sm font-medium">
                  Personal <span className="text-red-500">*</span>
                </Label>
                <Select value={staff} onValueChange={setStaff} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el personal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="María">María</SelectItem>
                    <SelectItem value="Ana">Ana</SelectItem>
                    <SelectItem value="Carmen">Carmen</SelectItem>
                    <SelectItem value="Laura">Laura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Name */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Nombre del Cliente <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              {/* Client Email */}
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* Client Phone */}
              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Teléfono
                </Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Servicios, observaciones..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Staff Info */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Personal</Label>
                <div className="p-2 bg-gray-50 rounded text-sm">{staff}</div>
              </div>

              {/* Client Info */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Cliente
                </Label>
                <div className="p-2 bg-gray-50 rounded text-sm">{clientName}</div>
              </div>

              {clientEmail && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Label>
                  <div className="p-2 bg-gray-50 rounded text-sm">{clientEmail}</div>
                </div>
              )}

              {clientPhone && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Teléfono
                  </Label>
                  <div className="p-2 bg-gray-50 rounded text-sm">{clientPhone}</div>
                </div>
              )}

              {notes && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Notas
                  </Label>
                  <div className="p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">{notes}</div>
                </div>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button onClick={() => setIsEditing(true)} className="w-full bg-pink-600 hover:bg-pink-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Cita
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Cita
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
