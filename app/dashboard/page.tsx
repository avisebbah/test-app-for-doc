"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, FileText, Plus, Search, User } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

// Mock data for prescriptions
const recentPrescriptions = [
  {
    id: "1",
    patientName: "שרה כהן",
    patientId: "P-12345",
    date: "2023-05-15",
    status: "נשלח",
    medications: ['אמוקסיצילין 500 מ"ג', 'איבופרופן 400 מ"ג'],
  },
  {
    id: "2",
    patientName: "מיכאל לוי",
    patientId: "P-12346",
    date: "2023-05-14",
    status: "טיוטה",
    medications: ['ליסינופריל 10 מ"ג'],
  },
  {
    id: "3",
    patientName: "אמילי רודריגז",
    patientId: "P-12347",
    date: "2023-05-13",
    status: "נשלח",
    medications: ['מטפורמין 500 מ"ג', 'אטורבסטטין 20 מ"ג'],
  },
  {
    id: "4",
    patientName: "דוד קים",
    patientId: "P-12348",
    date: "2023-05-12",
    status: "נשלח",
    medications: ['לבותירוקסין 50 מק"ג'],
  },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPrescriptions = recentPrescriptions.filter(
    (prescription) =>
      prescription.patientName.includes(searchTerm) ||
      prescription.patientId.includes(searchTerm) ||
      prescription.medications.some((med) => med.includes(searchTerm)),
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">לוח בקרה</h1>
            <p className="text-gray-500 mt-1">נהל את המרשמים והמטופלים שלך</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="חיפוש מרשמים..."
                className="pr-9 w-[250px] h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/prescription/new">
              <Button className="bg-secondary hover:bg-secondary/90 text-white btn-animation">
                <Plus className="ml-2 h-4 w-4" />
                מרשם חדש
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">סה"כ מרשמים</CardTitle>
              <CardDescription>מכל הזמנים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary ml-3" />
                <div>
                  <p className="text-3xl font-bold">124</p>
                  <p className="text-sm text-gray-500">+12 החודש</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">מטופלים פעילים</CardTitle>
              <CardDescription>30 הימים האחרונים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-8 w-8 text-primary ml-3" />
                <div>
                  <p className="text-3xl font-bold">48</p>
                  <p className="text-sm text-gray-500">+5 החודש</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">פגישות קרובות</CardTitle>
              <CardDescription>7 הימים הקרובים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary ml-3" />
                <div>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm text-gray-500">הבא: היום, 14:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>מרשמים אחרונים</CardTitle>
            <CardDescription>צפה ונהל את המרשמים האחרונים שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">הכל</TabsTrigger>
                <TabsTrigger value="sent">נשלחו</TabsTrigger>
                <TabsTrigger value="draft">טיוטות</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription) => (
                    <PrescriptionCard key={prescription.id} prescription={prescription} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">לא נמצאו מרשמים</h3>
                    <p className="text-gray-500">נסה לשנות את מונחי החיפוש</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4">
                {filteredPrescriptions
                  .filter((p) => p.status === "נשלח")
                  .map((prescription) => (
                    <PrescriptionCard key={prescription.id} prescription={prescription} />
                  ))}
              </TabsContent>

              <TabsContent value="draft" className="space-y-4">
                {filteredPrescriptions
                  .filter((p) => p.status === "טיוטה")
                  .map((prescription) => (
                    <PrescriptionCard key={prescription.id} prescription={prescription} />
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function PrescriptionCard({ prescription }: { prescription: any }) {
  return (
    <Link href={`/prescription/${prescription.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors card-animation bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(prescription.patientName)}&background=random`}
              />
              <AvatarFallback>{prescription.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{prescription.patientName}</h3>
              <p className="text-sm text-gray-500">{prescription.patientId}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="h-3 w-3 ml-1" />
                <span>{new Date(prescription.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">תרופות:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {prescription.medications.map((med: string, idx: number) => (
                    <span key={idx} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-md">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Badge
            variant={prescription.status === "נשלח" ? "default" : "outline"}
            className={prescription.status === "טיוטה" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" : "bg-primary"}
          >
            {prescription.status}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
