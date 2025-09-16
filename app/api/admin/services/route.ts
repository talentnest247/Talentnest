import { type NextRequest, NextResponse } from "next/server"
import { getServices, updateServiceStatus } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const services = getServices()
    let filteredServices = services

    if (status && status !== "all") {
      filteredServices = filteredServices.filter((service) => service.status === status)
    }

    if (category && category !== "all") {
      filteredServices = filteredServices.filter((service) => service.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredServices = filteredServices.filter(
        (service) =>
          service.title.toLowerCase().includes(searchLower) || service.description.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({ services: filteredServices })
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { serviceId, status } = await request.json()

    // In a real app, verify admin authentication here

    const result = updateServiceStatus(serviceId, status)

    if (!result) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service status updated successfully" })
  } catch {
    return NextResponse.json({ error: "Failed to update service status" }, { status: 500 })
  }
}
