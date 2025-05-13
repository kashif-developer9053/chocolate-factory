import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="mt-2 h-4 w-[250px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="mt-2 h-4 w-[150px]" />
              <Skeleton className="mt-2 h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" disabled>
            Active
          </TabsTrigger>
          <TabsTrigger value="scheduled" disabled>
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="expired" disabled>
            Expired
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="mt-2 h-4 w-[200px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[60px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[120px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[80px]" />
                    <Skeleton className="mt-1 h-4 w-[60px]" />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
