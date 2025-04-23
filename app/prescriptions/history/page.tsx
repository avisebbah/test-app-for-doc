"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Printer,
  MoreHorizontal,
  Download,
  PhoneIcon as WhatsappIcon,
  Eye,
  Edit,
  Copy,
  Trash,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock prescription data
const prescriptions = [
  {
    id: "1",
    patientName: "ישראל ישראלי",
    patientId: "123456789",
    date: "2023-05-15",
    medications: ['אקמול 500 מ"ג', 'אדויל 200 מ"ג'],
    status: "נשלח",
    pharmacy: "סופר-פארם רמת אביב",
    signatureType: "digital",
    hasPdf: true,
  },
  {
    id: "2",
    patientName: "שרה כהן",
    patientId: "987654321",
    date: "2023-05-14",
    medications: ['אומפרדקס 20 מ"ג'],
    status: "טיוטה",
    pharmacy: "",
    signatureType: "manual",
    hasPdf: false,
  },
  {
    id: "3",
    patientName: "דוד לוי",
    patientId: "456789123",
    date: "2023-05-13",
    medications: ['נורופן 400 מ"ג', 'סימבקור 20 מ"ג'],
    status: "נשלח",
    pharmacy: "בית מרקחת מכבי - הרצליה",
    signatureType: "digital",
    hasPdf: true,
  },
  {
    id: "4",
    patientName: "רחל אברהם",
    patientId: "234567891",
    date: "2023-05-10",
    medications: ['קסנקס 0.5 מ"ג'],
    status: "נשלח",
    pharmacy: "סופר-פארם קניון איילון",
    signatureType: "digital",
    hasPdf: true,
  },
  {
    id: "5",
    patientName: "יעקב גולדברג",
    patientId: "345678912",
    date: "2023-05-08",
    medications: ['אקמול 500 מ"ג'],
    status: "נשלח",
    pharmacy: "בית מרקחת כללית - תל אביב",
    signatureType: "manual",
    hasPdf: true,
  },
]

export default function PrescriptionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // Filter prescriptions based on search term and filters
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName.includes(searchTerm) ||
      prescription.patientId.includes(searchTerm) ||
      prescription.medications.some((med) => med.includes(searchTerm))

    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter

    // Simple date filtering logic
    let matchesDate = true
    if (dateFilter === "last-week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      matchesDate = new Date(prescription.date) >= oneWeekAgo
    } else if (dateFilter === "last-month") {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      matchesDate = new Date(prescription.date) >= oneMonthAgo
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleSendWhatsApp = (prescription: any) => {
    setSelectedPrescription(prescription)
    setShowWhatsAppDialog(true)
  }

  const handlePreview = (prescription: any) => {
    setSelectedPrescription(prescription)
    setShowPreviewDialog(true)
  }

  const confirmSendWhatsApp = () => {
    // In a real app, this would use WhatsApp Business API or URL scheme
    console.log("Sending prescription via WhatsApp:", selectedPrescription)

    // Close dialog
    setShowWhatsAppDialog(false)

    // Show success message
    alert("המרשם נשלח בהצלחה")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">היסטוריית מרשמים</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="חפש לפי שם מטופל, ת.ז. או תרופה"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="סטטוס מרשם" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="נשלח">נשלח</SelectItem>
                <SelectItem value="טיוטה">טיוטה</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="תאריך" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל התאריכים</SelectItem>
                <SelectItem value="last-week">שבוע אחרון</SelectItem>
                <SelectItem value="last-month">חודש אחרון</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">כל המרשמים</TabsTrigger>
          <TabsTrigger value="sent">נשלחו</TabsTrigger>
          <TabsTrigger value="draft">טיוטות</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onSendWhatsApp={handleSendWhatsApp}
                  onPreview={handlePreview}
                />
              ))
            ) : (
              <div className="text-center p-8 border rounded-md bg-gray-50">
                <p className="text-gray-500">לא נמצאו מרשמים</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <div className="space-y-4">
            {filteredPrescriptions.filter((p) => p.status === "נשלח").length > 0 ? (
              filteredPrescriptions
                .filter((p) => p.status === "נשלח")
                .map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    onSendWhatsApp={handleSendWhatsApp}
                    onPreview={handlePreview}
                  />
                ))
            ) : (
              <div className="text-center p-8 border rounded-md bg-gray-50">
                <p className="text-gray-500">לא נמצאו מרשמים שנשלחו</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="space-y-4">
            {filteredPrescriptions.filter((p) => p.status === "טיוטה").length > 0 ? (
              filteredPrescriptions
                .filter((p) => p.status === "טיוטה")
                .map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    onSendWhatsApp={handleSendWhatsApp}
                    onPreview={handlePreview}
                  />
                ))
            ) : (
              <div className="text-center p-8 border rounded-md bg-gray-50">
                <p className="text-gray-500">לא נמצאו טיוטות מרשמים</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* WhatsApp Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>שליחת מרשם ב-WhatsApp</DialogTitle>
            <DialogDescription>המרשם יישלח כקובץ PDF מצורף להודעת WhatsApp</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedPrescription && (
              <div className="p-4 border rounded-md">
                <p className="font-medium">{selectedPrescription.patientName}</p>
                <p className="text-sm text-gray-500">ת.ז.: {selectedPrescription.patientId}</p>
                <p className="text-sm text-gray-500">תאריך: {selectedPrescription.date}</p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm">הזן מספר טלפון או בחר מרשימת אנשי קשר:</p>
              <Input className="mt-2" placeholder="הזן מספר טלפון כולל קידומת מדינה" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWhatsAppDialog(false)}>
              ביטול
            </Button>
            <Button onClick={confirmSendWhatsApp}>
              <WhatsappIcon className="h-4 w-4 mr-2" />
              שלח מרשם
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>תצוגה מקדימה של המרשם</DialogTitle>
            <DialogDescription>צפייה במרשם כפי שנשמר במערכת</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedPrescription && (
              <div className="border rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">מרשם רפואי</h2>
                    <p className="text-sm text-gray-500">תאריך: {selectedPrescription.date}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">ד"ר ישראלי</p>
                    <p className="text-sm">רישיון מס': 12345</p>
                    <p className="text-sm">טל': 03-1234567</p>
                  </div>
                </div>

                <div className="mb-6 p-4 border-t border-b">
                  <h3 className="font-medium mb-2">פרטי המטופל:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="font-medium">שם:</span> {selectedPrescription.patientName}
                    </p>
                    <p>
                      <span className="font-medium">ת.ז.:</span> {selectedPrescription.patientId}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">תרופות:</h3>
                  <div className="space-y-4">
                    {selectedPrescription.medications.map((med: string, index: number) => (
                      <div key={index} className="p-3 border rounded-md">
                        <p className="font-medium">
                          {index + 1}. {med}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="text-center">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-blue-700">
                        {selectedPrescription.signatureType === "digital" ? "חתימה דיגיטלית מאובטחת" : "חתימה ידנית"}
                      </p>
                    </div>
                    <p className="text-sm font-medium">ד"ר ישראלי</p>
                    <p className="text-xs text-gray-500">חתימה וחותמת הרופא</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              סגור
            </Button>
            {selectedPrescription && selectedPrescription.hasPdf && (
              <Button>
                <Download className="h-4 w-4 mr-2" />
                הורד PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PrescriptionCard({
  prescription,
  onSendWhatsApp,
  onPreview,
}: {
  prescription: any
  onSendWhatsApp: (prescription: any) => void
  onPreview: (prescription: any) => void
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-lg">{prescription.patientName}</h3>
              <Badge
                variant={prescription.status === "נשלח" ? "success" : "outline"}
                className={prescription.status === "טיוטה" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}
              >
                {prescription.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-1">ת.ז.: {prescription.patientId}</p>
            <p className="text-sm text-gray-500 mb-3">תאריך: {prescription.date}</p>

            <div className="space-y-1">
              <p className="text-sm font-medium">תרופות:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {prescription.medications.map((med: string, index: number) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>

            {prescription.pharmacy && <p className="text-sm text-gray-500 mt-3">נשלח ל: {prescription.pharmacy}</p>}

            <div className="flex items-center mt-3 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>חתימה {prescription.signatureType === "digital" ? "דיגיטלית" : "ידנית"}</span>
              {prescription.hasPdf && (
                <>
                  <span className="mx-1">•</span>
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  <span>PDF זמין</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onPreview(prescription)}>
              <Eye className="h-4 w-4 mr-2" />
              צפה
            </Button>

            <Button variant="outline" size="sm" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              הדפס
            </Button>

            {prescription.hasPdf && (
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}

            <Button variant="outline" size="sm" className="flex-1" onClick={() => onSendWhatsApp(prescription)}>
              <WhatsappIcon className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  ערוך מרשם
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  שכפל מרשם
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  מחק
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
