import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="space-y-2 pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Skeleton className="h-10 w-full md:w-96" />
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-8 w-[110px]" />
                  <Skeleton className="h-8 w-[110px]" />
                  <Skeleton className="h-8 w-[140px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="h-10 px-4 text-left">
                            <Skeleton className="h-4 w-24" />
                          </th>
                          <th className="h-10 px-4 text-left">
                            <Skeleton className="h-4 w-16" />
                          </th>
                          <th className="h-10 px-4 text-left">
                            <Skeleton className="h-4 w-20" />
                          </th>
                          <th className="h-10 px-4 text-left">
                            <Skeleton className="h-4 w-16" />
                          </th>
                          <th className="h-10 px-4 text-left">
                            <Skeleton className="h-4 w-16" />
                          </th>
                          <th className="h-10 px-4 text-left">
                            <Skeleton className="h-4 w-16" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="mt-1 h-3 w-24" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="p-4">
                              <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="p-4">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="p-4">
                              <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="p-4">
                              <Skeleton className="h-8 w-8" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="text-center">
                  <Skeleton className="mx-auto h-6 w-32" />
                  <Skeleton className="mx-auto mt-1 h-4 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
