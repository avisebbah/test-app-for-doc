"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AppHeader } from "@/components/app-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Download, FileText, Pen, Plus, Save, Search, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RichTextEditor } from "@/components/rich-text-editor"
import { SignatureCanvas } from "@/components/signature-canvas"

// מאגר תרופות לדוגמה
const medicationDatabase = [
  {
    id: "1",
    name: "אמוקסיצילין",
    genericName: "אמוקסיצילין",
    strength: '500 מ"ג',
    form: "כמוסה",
    category: "אנטיביוטיקה",
    code: "AMX500",
    manufacturer: "גנרי",
  },
  {
    id: "2",
    name: "ליסינופריל",
    genericName: "ליסינופריל",
    strength: '10 מ"ג',
    form: "טבליה",
    category: "מעכב ACE",
    code: "LSP10",
    manufacturer: "גנרי",
  },
  {
    id: "3",
    name: "מטפורמין",
    genericName: "מטפורמין HCl",
    strength: '500 מ"ג',
    form: "טבליה",
    category: "אנטי-סוכרתי",
    code: "MTF500",
    manufacturer: "גנרי",
  },
  {
    id: "4",
    name: "אטורבסטטין",
    genericName: "אטורבסטטין קלציום",
    strength: '20 מ"ג',
    form: "טבליה",
    category: "סטטין",
    code: "ATV20",
    manufacturer: "גנרי",
  },
  {
    id: "5",
    name: "לבותירוקסין",
    genericName: "לבותירוקסין נתרן",
    strength: '50 מק"ג',
    form: "טבליה",
    category: "הורמון בלוטת התריס",
    code: "LVT50",
    manufacturer: "גנרי",
  },
]

export default function NewPrescriptionPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMedications, setSelectedMedications] = useState<any[]>([])
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
  })
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [signatureType, setSignatureType] = useState("digital")
  const [signatureData, setSignatureData] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [showNewMedicationDialog, setShowNewMedicationDialog] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: "",
    genericName: "",
    strength: "",
    form: "",
    category: "",
    code: "",
    manufacturer: "",
  })

  const signatureRef = useRef<any>(null)

  const filteredMedications = medicationDatabase.filter(
    (med) =>
      med.name.includes(searchTerm) ||
      med.genericName.includes(searchTerm) ||
      med.code.includes(searchTerm) ||
      med.category.includes(searchTerm),
  )

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMedication = (medication: any) => {
    setSelectedMedications((prev) => [
      ...prev,
      {
        ...medication,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ])
  }

  const handleRemoveMedication = (id: string) => {
    setSelectedMedications((prev) => prev.filter((med) => med.id !== id))
  }

  const handleMedicationChange = (id: string, field: string, value: string) => {
    setSelectedMedications((prev) => prev.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const handleNewMedicationChange = (field: string, value: string) => {
    setNewMedication((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddNewMedication = () => {
    const newMed = {
      ...newMedication,
      id: `new-${Date.now()}`,
    }

    handleAddMedication(newMed)
    setNewMedication({
      name: "",
      genericName: "",
      strength: "",
      form: "",
      category: "",
      code: "",
      manufacturer: "",
    })
    setShowNewMedicationDialog(false)
  }

  const handleDigitalSign = () => {
    setSignatureData(`ד"ר כהן - חתימה דיגיטלית - ${new Date().toLocaleString()}`)
  }

  const handleManualSign = () => {
    if (signatureRef.current) {
      const signatureDataURL = signatureRef.current.toDataURL()
      setSignatureData(signatureDataURL)
    }
  }

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setSignatureData("")
    }
  }

  const saveDraft = () => {
    console.log("שומר טיוטה...")
    alert("טיוטת המרשם נשמרה בהצלחה")
  }

  const sendWhatsApp = () => {
    setShowWhatsAppDialog(true)
  }

  const confirmSendWhatsApp = () => {
    setShowWhatsAppDialog(false)
    alert("המרשם נשלח בהצלחה באמצעות וואטסאפ")
  }

  const previewPrescription = () => {
    setShowPreview(true)
  }

  const isPatientInfoComplete = () => {
    return patientData.firstName && patientData.lastName && patientData.idNumber
  }

  const isMedicationInfoComplete = () => {
    return (
      selectedMedications.length > 0 && selectedMedications.every((med) => med.dosage && med.frequency && med.duration)
    )
  }

  const isSignatureComplete = () => {
    return signatureData !== ""
  }

  const canSubmit = isPatientInfoComplete() && isMedicationInfoComplete() && isSignatureComplete()

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

      <main className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">מרשם חדש</h1>
            <p className="text-gray-500 mt-1">צור מרשם דיגיטלי חדש</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עמודה שמאלית - בחירת תרופות */}
          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle>בחירת תרופות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="חיפוש תרופות..."
                    className="pr-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="border rounded-md h-[400px] overflow-y-auto bg-white">
                  {filteredMedications.length > 0 ? (
                    <div className="divide-y">
                      {filteredMedications.map((med) => (
                        <div key={med.id} className="p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{med.name}</p>
                              <p className="text-sm text-gray-500">
                                {med.genericName}, {med.strength}, {med.form}
                              </p>
                              <div className="flex items-center mt-1 space-x-1">
                                <Badge variant="outline" className="text-xs">
                                  {med.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  קוד: {med.code}
                                </Badge>
                              </div>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={() => handleAddMedication(med)}
                                    disabled={selectedMedications.some((m) => m.id === med.id)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>הוסף למרשם</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                                הצג פרטים נוספים
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">
                                  {med.name} ({med.genericName})
                                </h4>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                  <span className="text-gray-500">יצרן:</span>
                                  <span>{med.manufacturer}</span>
                                  <span className="text-gray-500">קטגוריה:</span>
                                  <span>{med.category}</span>
                                  <span className="text-gray-500">קוד:</span>
                                  <span>{med.code}</span>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">לא נמצאו תרופות</div>
                  )}
                </div>

                <Button variant="outline" className="w-full" onClick={() => setShowNewMedicationDialog(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף תרופה מותאמת אישית
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* עמודה ימנית - טופס מרשם */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>פרטי המרשם</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* פרטי מטופל */}
                <div>
                  <h3 className="text-lg font-medium mb-4">פרטי המטופל</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">שם פרטי</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={patientData.firstName}
                        onChange={handlePatientChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">שם משפחה</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={patientData.lastName}
                        onChange={handlePatientChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">מספר תעודת זהות</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={patientData.idNumber}
                        onChange={handlePatientChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">תאריך לידה</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={patientData.dateOfBirth}
                        onChange={handlePatientChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">מגדר</Label>
                      <Select
                        value={patientData.gender}
                        onValueChange={(value) => setPatientData((prev) => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger id="gender" className="h-10">
                          <SelectValue placeholder="בחר מגדר" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">זכר</SelectItem>
                          <SelectItem value="female">נקבה</SelectItem>
                          <SelectItem value="other">אחר</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">מספר טלפון</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={patientData.phone}
                        onChange={handlePatientChange}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* תרופות שנבחרו */}
                <div>
                  <h3 className="text-lg font-medium mb-4">תרופות שנבחרו</h3>
                  {selectedMedications.length > 0 ? (
                    <div className="space-y-4">
                      {selectedMedications.map((med) => (
                        <div key={med.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900">{med.name}</h4>
                              <p className="text-sm text-gray-500">
                                {med.genericName}, {med.strength}, {med.form}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-red-500"
                              onClick={() => handleRemoveMedication(med.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor={`dosage-${med.id}`}>מינון</Label>
                              <Input
                                id={`dosage-${med.id}`}
                                value={med.dosage}
                                onChange={(e) => handleMedicationChange(med.id, "dosage", e.target.value)}
                                placeholder="לדוגמה: טבליה אחת"
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`frequency-${med.id}`}>תדירות</Label>
                              <Select
                                value={med.frequency}
                                onValueChange={(value) => handleMedicationChange(med.id, "frequency", value)}
                              >
                                <SelectTrigger id={`frequency-${med.id}`} className="h-10">
                                  <SelectValue placeholder="בחר תדירות" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="once-daily">פעם ביום</SelectItem>
                                  <SelectItem value="twice-daily">פעמיים ביום</SelectItem>
                                  <SelectItem value="three-times-daily">שלוש פעמים ביום</SelectItem>
                                  <SelectItem value="four-times-daily">ארבע פעמים ביום</SelectItem>
                                  <SelectItem value="as-needed">לפי הצורך</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`duration-${med.id}`}>משך הטיפול</Label>
                              <Select
                                value={med.duration}
                                onValueChange={(value) => handleMedicationChange(med.id, "duration", value)}
                              >
                                <SelectTrigger id={`duration-${med.id}`} className="h-10">
                                  <SelectValue placeholder="בחר משך" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3-days">3 ימים</SelectItem>
                                  <SelectItem value="5-days">5 ימים</SelectItem>
                                  <SelectItem value="7-days">שבוע</SelectItem>
                                  <SelectItem value="14-days">שבועיים</SelectItem>
                                  <SelectItem value="30-days">חודש</SelectItem>
                                  <SelectItem value="chronic">טיפול קבוע</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`instructions-${med.id}`}>הוראות מיוחדות</Label>
                            <Textarea
                              id={`instructions-${med.id}`}
                              value={med.instructions}
                              onChange={(e) => handleMedicationChange(med.id, "instructions", e.target.value)}
                              placeholder="הוראות נוספות לתרופה זו"
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-lg bg-gray-50">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900">לא נבחרו תרופות</h4>
                      <p className="text-gray-500">חפש ובחר תרופות מהרשימה</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* הערות נוספות */}
                <div>
                  <h3 className="text-lg font-medium mb-4">הערות נוספות</h3>
                  <RichTextEditor value={additionalNotes} onChange={setAdditionalNotes} />
                </div>

                <Separator />

                {/* חתימה */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">חתימה</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">דיגיטלית</span>
                      <Switch
                        checked={signatureType === "manual"}
                        onCheckedChange={(checked) => setSignatureType(checked ? "manual" : "digital")}
                      />
                      <span className="text-sm text-gray-500">ידנית</span>
                    </div>
                  </div>

                  {signatureType === "digital" ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500 mb-4">
                          חתימה דיגיטלית משתמשת בטכנולוגיית JWT ו-PKI מאובטחת ליצירת חתימה אלקטרונית חוקית.
                        </p>
                        <Button onClick={handleDigitalSign} className="bg-secondary hover:bg-secondary/90 text-white">
                          <Check className="h-4 w-4 ml-2" />
                          חתום דיגיטלית
                        </Button>
                      </div>

                      {signatureData && (
                        <div className="p-4 border rounded-lg bg-blue-50">
                          <p className="font-medium text-blue-700">{signatureData}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-white">
                        <p className="text-sm text-gray-500 mb-2">חתום באמצעות העכבר או מסך המגע:</p>
                        <div className="border rounded-lg bg-white">
                          <SignatureCanvas
                            ref={signatureRef}
                            canvasProps={{
                              width: 500,
                              height: 200,
                              className: "w-full h-[200px] border rounded-lg",
                            }}
                          />
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" onClick={clearSignature}>
                            נקה
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleManualSign}
                            className="bg-secondary hover:bg-secondary/90 text-white"
                          >
                            <Pen className="h-4 w-4 ml-2" />
                            שמור חתימה
                          </Button>
                        </div>
                      </div>

                      {signatureType === "manual" && signatureData && (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">החתימה שנשמרה:</p>
                          <img src={signatureData || "/placeholder.svg"} alt="חתימה" className="border rounded-lg" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-2 border-t p-6 bg-gray-50">
                <Button variant="outline" onClick={saveDraft}>
                  <Save className="h-4 w-4 ml-2" />
                  שמור טיוטה
                </Button>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={previewPrescription} disabled={!canSubmit}>
                    <FileText className="h-4 w-4 ml-2" />
                    תצוגה מקדימה
                  </Button>
                  <Button
                    onClick={sendWhatsApp}
                    disabled={!canSubmit}
                    className="bg-secondary hover:bg-secondary/90 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                    >
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                      <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                      <path d="M9 14a5 5 0 0 0 6 0" />
                    </svg>
                    שלח בוואטסאפ
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* דיאלוג תרופה חדשה */}
        <Dialog open={showNewMedicationDialog} onOpenChange={setShowNewMedicationDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>הוסף תרופה מותאמת אישית</DialogTitle>
              <DialogDescription>הזן פרטים עבור תרופה שאינה נמצאת במאגר</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">שם התרופה</Label>
                <Input
                  id="med-name"
                  value={newMedication.name}
                  onChange={(e) => handleNewMedicationChange("name", e.target.value)}
                  placeholder="שם התרופה"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="med-generic">שם גנרי</Label>
                <Input
                  id="med-generic"
                  value={newMedication.genericName}
                  onChange={(e) => handleNewMedicationChange("genericName", e.target.value)}
                  placeholder="שם גנרי"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="med-strength">חוזק</Label>
                <Input
                  id="med-strength"
                  value={newMedication.strength}
                  onChange={(e) => handleNewMedicationChange("strength", e.target.value)}
                  placeholder='לדוגמה: 500 מ"ג'
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="med-form">צורה</Label>
                <Select value={newMedication.form} onValueChange={(value) => handleNewMedicationChange("form", value)}>
                  <SelectTrigger id="med-form">
                    <SelectValue placeholder="בחר צורה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="טבליה">טבליה</SelectItem>
                    <SelectItem value="כמוסה">כמוסה</SelectItem>
                    <SelectItem value="סירופ">סירופ</SelectItem>
                    <SelectItem value="משחה">משחה</SelectItem>
                    <SelectItem value="טיפות">טיפות</SelectItem>
                    <SelectItem value="זריקה">זריקה</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="med-category">קטגוריה</Label>
                <Input
                  id="med-category"
                  value={newMedication.category}
                  onChange={(e) => handleNewMedicationChange("category", e.target.value)}
                  placeholder="קטגוריה"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="med-code">קוד תרופה</Label>
                <Input
                  id="med-code"
                  value={newMedication.code}
                  onChange={(e) => handleNewMedicationChange("code", e.target.value)}
                  placeholder="קוד תרופה"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="med-manufacturer">יצרן</Label>
                <Input
                  id="med-manufacturer"
                  value={newMedication.manufacturer}
                  onChange={(e) => handleNewMedicationChange("manufacturer", e.target.value)}
                  placeholder="שם היצרן"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewMedicationDialog(false)}>
                ביטול
              </Button>
              <Button onClick={handleAddNewMedication} className="bg-secondary hover:bg-secondary/90 text-white">
                הוסף תרופה
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* דיאלוג וואטסאפ */}
        <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>שליחת מרשם באמצעות וואטסאפ</DialogTitle>
              <DialogDescription>המרשם יישלח כקובץ PDF מצורף</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="font-medium">סיכום המרשם</p>
                <p className="text-sm text-gray-500">
                  מטופל: {patientData.firstName} {patientData.lastName}
                </p>
                <p className="text-sm text-gray-500">תרופות: {selectedMedications.map((med) => med.name).join(", ")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">מספר טלפון הנמען</Label>
                <Input id="phone-number" placeholder="הזן מספר טלפון כולל קידומת מדינה" className="h-10" />
                <p className="text-xs text-gray-500">לדוגמה: +972501234567 (כולל קידומת מדינה)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">הודעה נוספת (אופציונלי)</Label>
                <Textarea id="message" placeholder="הוסף הודעה שתלווה את המרשם" className="min-h-[80px]" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWhatsAppDialog(false)}>
                ביטול
              </Button>
              <Button onClick={confirmSendWhatsApp} className="bg-secondary hover:bg-secondary/90 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9 14a5 5 0 0 0 6 0" />
                </svg>
                שלח מרשם
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* דיאלוג תצוגה מקדימה */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>תצוגה מקדימה של המרשם</DialogTitle>
              <DialogDescription>צפה באופן שבו המרשם יופיע</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="border rounded-lg p-8 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">מרשם רפואי</h2>
                    <p className="text-sm text-gray-500">תאריך: {new Date().toLocaleDateString("he-IL")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">ד"ר כהן</p>
                    <p className="text-sm">מס' רישיון: 12345</p>
                    <p className="text-sm">טלפון: 03-1234567</p>
                  </div>
                </div>

                <div className="mb-8 p-4 border-t border-b">
                  <h3 className="font-medium mb-2">פרטי המטופל:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="font-medium">שם:</span> {patientData.firstName} {patientData.lastName}
                    </p>
                    <p>
                      <span className="font-medium">ת.ז.:</span> {patientData.idNumber}
                    </p>
                    <p>
                      <span className="font-medium">תאריך לידה:</span> {patientData.dateOfBirth || "לא צוין"}
                    </p>
                    <p>
                      <span className="font-medium">מגדר:</span>{" "}
                      {patientData.gender === "male" ? "זכר" : patientData.gender === "female" ? "נקבה" : "לא צוין"}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium mb-4">תרופות:</h3>
                  <div className="space-y-4">
                    {selectedMedications.map((med, index) => (
                      <div key={med.id} className="p-4 border rounded-md">
                        <p className="font-medium">
                          {index + 1}. {med.name} ({med.genericName}), {med.strength}, {med.form}
                        </p>
                        <div className="text-sm mt-2">
                          <p>
                            <span className="font-medium">מינון:</span> {med.dosage}
                          </p>
                          <p>
                            <span className="font-medium">תדירות:</span>{" "}
                            {{
                              "once-daily": "פעם ביום",
                              "twice-daily": "פעמיים ביום",
                              "three-times-daily": "שלוש פעמים ביום",
                              "four-times-daily": "ארבע פעמים ביום",
                              "as-needed": "לפי הצורך",
                            }[med.frequency] || med.frequency}
                          </p>
                          <p>
                            <span className="font-medium">משך הטיפול:</span>{" "}
                            {{
                              "3-days": "3 ימים",
                              "5-days": "5 ימים",
                              "7-days": "שבוע",
                              "14-days": "שבועיים",
                              "30-days": "חודש",
                              chronic: "טיפול קבוע",
                            }[med.duration] || med.duration}
                          </p>
                          {med.instructions && (
                            <p>
                              <span className="font-medium">הוראות מיוחדות:</span> {med.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {additionalNotes && (
                  <div className="mb-8">
                    <h3 className="font-medium mb-2">הערות נוספות:</h3>
                    <div
                      className="p-4 border rounded-md text-sm"
                      dangerouslySetInnerHTML={{ __html: additionalNotes }}
                    />
                  </div>
                )}

                <div className="mt-12 flex justify-end">
                  <div className="text-center">
                    <div className="mb-2">
                      {signatureType === "digital" ? (
                        <p className="text-sm font-medium text-blue-700">{signatureData}</p>
                      ) : (
                        signatureData && <img src={signatureData || "/placeholder.svg"} alt="חתימה" className="h-16" />
                      )}
                    </div>
                    <p className="text-sm font-medium">ד"ר כהן</p>
                    <p className="text-xs text-gray-500">חתימת הרופא</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                סגור
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90 text-white">
                <Download className="h-4 w-4 ml-2" />
                הורד PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
