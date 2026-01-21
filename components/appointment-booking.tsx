"use client"

import { useState, useMemo } from "react"
import { Info, Check, Clock, DollarSign, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

type BaseService = {
  id: string
  name: string
  price: number | null
  priceRange?: { min: number; max: number }
  duration: number
  description: string
  hasLengthOptions: boolean
}

type LengthOption = {
  id: string
  name: string
  prices: { hardGel: number; polygel: number }
}

type NailArtTier = {
  id: string
  tier: number
  price: number
  duration: number
  description: string
}

type RemovalOption = {
  id: string
  name: string
  price: number
  duration: number
}

const baseServices: BaseService[] = [
  {
    id: "hard-gel-overlay",
    name: "Hard Gel Overlay",
    price: 50,
    duration: 90,
    description: "Includes manicure. Can be combined with nail art or removals.",
    hasLengthOptions: false,
  },
  {
    id: "hard-gel-extensions",
    name: "Hard Gel Extensions",
    price: null,
    priceRange: { min: 55, max: 85 },
    duration: 150,
    description: "Includes manicure. Price varies by length. Can be combined with nail art or removals.",
    hasLengthOptions: true,
  },
  {
    id: "polygel-extensions",
    name: "Polygel Extensions",
    price: null,
    priceRange: { min: 60, max: 100 },
    duration: 180,
    description: "Includes manicure. Price varies by length. Can be combined with nail art or removals.",
    hasLengthOptions: true,
  },
  {
    id: "same-product-fill",
    name: "Same Product Fill-In",
    price: 45,
    duration: 90,
    description: "Fill-in service for nails I previously did. Includes manicure.",
    hasLengthOptions: false,
  },
]

const lengthOptions: LengthOption[] = [
  { id: "short", name: "Short", prices: { hardGel: 55, polygel: 60 } },
  { id: "medium", name: "Medium", prices: { hardGel: 65, polygel: 70 } },
  { id: "long", name: "Long", prices: { hardGel: 75, polygel: 80 } },
  { id: "xl-xxxl", name: "XL-XXXL", prices: { hardGel: 85, polygel: 100 } },
]

const nailArtTiers: NailArtTier[] = [
  {
    id: "tier-1",
    tier: 1,
    price: 10,
    duration: 30,
    description: "French tips, chrome or pearl finish, single color aura, single color marble",
  },
  {
    id: "tier-2",
    tier: 2,
    price: 15,
    duration: 45,
    description: "More than 1 design, bloom art, animal prints, two or more colors, single accent finger with any kind of art",
  },
  {
    id: "tier-3",
    tier: 3,
    price: 20,
    duration: 60,
    description: "More than 3 different designs or colors, 3D art, hand painted nail art, foils or stamps",
  },
  {
    id: "tier-4",
    tier: 4,
    price: 30,
    duration: 90,
    description: "4 or more different designs or colors, encapsulation, junk nails, more than 1 bling nail, sculpted art, unique nail shapes",
  },
]

const removalOptions: RemovalOption[] = [
  {
    id: "foreign-removal",
    name: "Foreign Product Removal",
    price: 15,
    duration: 45,
  },
  {
    id: "my-removal",
    name: "My Product Removal",
    price: 0,
    duration: 45,
  },
]

export default function AppointmentBooking() {
  const [selectedBaseService, setSelectedBaseService] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const [selectedArtTier, setSelectedArtTier] = useState<string | null>(null)
  const [selectedRemoval, setSelectedRemoval] = useState<string | null>(null)

  const selectedBase = baseServices.find((s) => s.id === selectedBaseService)
  const showLengthSection = selectedBase?.hasLengthOptions

  const calculations = useMemo(() => {
    let totalPrice = 0
    let totalDuration = 0
    const selectedItems: { name: string; price: number; duration: number }[] = []

    if (selectedBase) {
      let basePrice = selectedBase.price ?? 0
      if (selectedBase.hasLengthOptions && selectedLength) {
        const length = lengthOptions.find((l) => l.id === selectedLength)
        if (length) {
          basePrice =
            selectedBase.id === "hard-gel-extensions"
              ? length.prices.hardGel
              : length.prices.polygel
        }
      }
      totalPrice += basePrice
      totalDuration += selectedBase.duration
      selectedItems.push({
        name: selectedBase.name + (selectedLength ? ` (${lengthOptions.find(l => l.id === selectedLength)?.name})` : ""),
        price: basePrice,
        duration: selectedBase.duration,
      })
    }

    if (selectedArtTier) {
      const tier = nailArtTiers.find((t) => t.id === selectedArtTier)
      if (tier) {
        totalPrice += tier.price
        totalDuration += tier.duration
        selectedItems.push({
          name: `Nail Art Tier ${tier.tier}`,
          price: tier.price,
          duration: tier.duration,
        })
      }
    }

    if (selectedRemoval) {
      const removal = removalOptions.find((r) => r.id === selectedRemoval)
      if (removal) {
        totalPrice += removal.price
        totalDuration += removal.duration
        selectedItems.push({
          name: removal.name,
          price: removal.price,
          duration: removal.duration,
        })
      }
    }

    return { totalPrice, totalDuration, selectedItems }
  }, [selectedBase, selectedLength, selectedArtTier, selectedRemoval])

  const canContinue = useMemo(() => {
    if (!selectedBaseService || !selectedArtTier) return false
    if (showLengthSection && !selectedLength) return false
    return true
  }, [selectedBaseService, selectedArtTier, selectedLength, showLengthSection])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}min`
    if (mins === 0) return `${hours}hr`
    return `${hours}hr ${mins}min`
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-52">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -left-32 top-1/3 size-80 rounded-full bg-emerald-50/60 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 size-72 rounded-full bg-stone-200/50 blur-3xl" />
      </div>

      <TooltipProvider>
        <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
          {/* Header */}
          <header className="mb-14 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-emerald-700/30" />
              <Sparkles className="size-4 text-emerald-700" />
              <div className="h-px w-12 bg-emerald-700/30" />
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
              Book Your Appointment
            </h1>
            <p className="mt-4 font-sans text-lg text-stone-600 tracking-wide">
              Curate your perfect nail experience
            </p>
          </header>

          {/* Section 1: Base Service */}
          <section className="mb-14">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                Select Your Service
              </h2>
              <p className="mt-1 text-sm text-stone-500 tracking-wide uppercase">Required</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {baseServices.map((service) => (
                <Card
                  key={service.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 py-0 bg-white/80 backdrop-blur-sm",
                    selectedBaseService === service.id
                      ? "ring-2 ring-emerald-700 shadow-lg shadow-emerald-900/10"
                      : "hover:shadow-md hover:shadow-stone-900/5 border-stone-200"
                  )}
                  onClick={() => {
                    setSelectedBaseService(service.id)
                    if (!service.hasLengthOptions) {
                      setSelectedLength(null)
                    }
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-medium text-stone-900 leading-tight">{service.name}</h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="text-stone-400 hover:text-emerald-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="size-4" />
                            <span className="sr-only">Service info</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-stone-900 text-stone-100">
                          <p>{service.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-stone-900 font-medium">
                        <DollarSign className="size-3.5 text-emerald-700" />
                        {service.price !== null
                          ? `$${service.price}`
                          : `$${service.priceRange?.min}–$${service.priceRange?.max}`}
                      </span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <Clock className="size-3.5" />
                        {service.duration}min
                      </span>
                    </div>
                    {selectedBaseService === service.id && (
                      <div className="mt-4 flex items-center gap-1.5 text-emerald-700 text-sm font-medium">
                        <Check className="size-4" />
                        Selected
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 2: Length Selection (Conditional) */}
          {showLengthSection && (
            <section className="mb-14">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                  Choose Your Length
                </h2>
                <p className="mt-1 text-sm text-stone-500 tracking-wide uppercase">Required</p>
              </div>
              <div className="mb-6 overflow-hidden rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm p-6">
                <div className="aspect-[3/1] w-full rounded-xl bg-stone-100 flex items-center justify-center">
                  <span className="text-stone-400 text-sm tracking-wide">Nail length reference</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {lengthOptions.map((option) => {
                  const price =
                    selectedBase?.id === "hard-gel-extensions"
                      ? option.prices.hardGel
                      : option.prices.polygel
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(
                        "flex flex-col items-center rounded-xl border p-5 transition-all duration-300 bg-white/80 backdrop-blur-sm",
                        selectedLength === option.id
                          ? "border-emerald-700 ring-2 ring-emerald-700 shadow-lg shadow-emerald-900/10"
                          : "border-stone-200 hover:border-emerald-700/30 hover:shadow-md hover:shadow-stone-900/5"
                      )}
                      onClick={() => setSelectedLength(option.id)}
                    >
                      <span className="font-serif text-lg font-medium text-stone-900">{option.name}</span>
                      <span className="mt-1 text-sm text-stone-500">${price}</span>
                      {selectedLength === option.id && (
                        <Check className="mt-3 size-4 text-emerald-700" />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Section 3: Nail Art Tier */}
          <section className="mb-14">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                Select Your Nail Art
              </h2>
              <p className="mt-1 text-sm text-stone-500 tracking-wide uppercase">Required</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {nailArtTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 py-0 bg-white/80 backdrop-blur-sm overflow-hidden",
                    selectedArtTier === tier.id
                      ? "ring-2 ring-emerald-700 shadow-lg shadow-emerald-900/10"
                      : "hover:shadow-md hover:shadow-stone-900/5 border-stone-200"
                  )}
                  onClick={() => setSelectedArtTier(tier.id)}
                >
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-medium text-stone-900">Tier {tier.tier}</h3>
                        {selectedArtTier === tier.id && (
                          <Check className="size-4 text-emerald-700" />
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-stone-900 font-medium">+${tier.price}</span>
                        <span className="text-stone-500">+{tier.duration}min</span>
                      </div>
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="description" className="border-t border-stone-100 border-b-0">
                        <AccordionTrigger
                          className="px-5 py-3 text-sm text-stone-600 hover:text-emerald-700 hover:no-underline transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View details
                        </AccordionTrigger>
                        <AccordionContent className="px-5 text-stone-500 leading-relaxed">
                          {tier.description}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 4: Removal Options */}
          <section className="mb-14">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                Need Removal?
              </h2>
              <p className="mt-1 text-sm text-stone-500 tracking-wide uppercase">Optional</p>
            </div>
            <div className="space-y-3">
              {removalOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all duration-300 bg-white/80 backdrop-blur-sm",
                    selectedRemoval === option.id
                      ? "border-emerald-700 ring-2 ring-emerald-700 shadow-lg shadow-emerald-900/10"
                      : "border-stone-200 hover:border-emerald-700/30 hover:shadow-md hover:shadow-stone-900/5"
                  )}
                >
                  <Checkbox
                    checked={selectedRemoval === option.id}
                    onCheckedChange={(checked) => {
                      setSelectedRemoval(checked ? option.id : null)
                    }}
                    className="border-stone-300 data-[state=checked]:bg-emerald-700 data-[state=checked]:border-emerald-700"
                  />
                  <div className="flex-1">
                    <span className="font-serif text-lg font-medium text-stone-900">{option.name}</span>
                    <div className="mt-1 flex items-center gap-3 text-sm text-stone-500">
                      <span>{option.price === 0 ? "Complimentary" : `+$${option.price}`}</span>
                      <span>+{option.duration}min</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>
      </TooltipProvider>

      {/* Summary Box - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.1)]">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              {calculations.selectedItems.length > 0 ? (
                <>
                  <p className="text-xs font-medium text-stone-500 mb-3 tracking-widest uppercase">Your Selection</p>
                  <ul className="space-y-1.5">
                    {calculations.selectedItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-stone-700">
                        <span className="size-1.5 rounded-full bg-emerald-700" />
                        <span className="font-medium">{item.name}</span>
                        <span className="text-stone-400">—</span>
                        <span className="text-stone-500">${item.price}</span>
                        <span className="text-stone-300">|</span>
                        <span className="text-stone-500">{item.duration}min</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-6 border-t border-stone-100 pt-4">
                    <span className="font-serif text-xl font-semibold text-stone-900">
                      ${calculations.totalPrice}
                    </span>
                    <span className="text-stone-500">
                      {formatDuration(calculations.totalDuration)} estimated
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-500 italic">
                  Select services to see your total
                </p>
              )}
            </div>
            <Button
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium tracking-wide md:w-auto md:px-10"
              disabled={!canContinue}
            >
              Continue to Select Time
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
