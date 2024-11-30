import { RequestForm } from '@/components/requests/request-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">New Request</h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Form</CardTitle>
            </CardHeader>
            <CardContent>
             <RequestForm />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default page