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

      <Tabs defaultValue="coupons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="coupons" disabled>
            Coupon Codes
          </TabsTrigger>
          <TabsTrigger value="promotions" disabled>
            Promotional Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="mt-2 h-4 w-[200px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[80px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[60px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-6 w-[70px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[50px]" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-[180px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-5 w-[70px]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-5 w-[60px]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
