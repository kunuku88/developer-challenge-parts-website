<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'

definePageMeta({ title: 'My Quote — BAS World' })

const store = useQuoteStore()
const showClearModal = ref(false)

onMounted(() => store.hydrate())

function confirmClear() {
    store.clearQuote()
    showClearModal.value = false
}

useHead({ title: 'My Quote — BAS World' })
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <h1 class="mb-6 text-2xl font-bold text-[#1C1C1A]">My Quote</h1>

        <div
            v-if="!store.items.length"
            class="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[#B5B5B5] py-16 text-center"
        >
            <ClipboardList class="size-12 text-[#B5B5B5]" aria-hidden="true" />
            <p class="text-lg font-medium text-[#1C1C1A]">Your quote list is empty</p>
            <NuxtLink
                to="/"
                class="rounded-lg bg-[#1DA05E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#116037]"
            >
                Browse Parts
            </NuxtLink>
        </div>

        <template v-else>
            <div class="overflow-x-auto rounded-xl border border-[#B5B5B5] bg-white shadow-sm">
                <table class="w-full text-sm">
                    <thead class="border-b border-[#B5B5B5] bg-[#F5F5F5]">
                        <tr>
                            <th
                                scope="col"
                                class="px-4 py-3 text-left font-semibold text-[#1C1C1A]"
                            >
                                Part
                            </th>
                            <th
                                scope="col"
                                class="hidden px-4 py-3 text-left font-semibold text-[#1C1C1A] md:table-cell"
                            >
                                Brand
                            </th>
                            <th
                                scope="col"
                                class="hidden px-4 py-3 text-left font-semibold text-[#1C1C1A] md:table-cell"
                            >
                                Condition
                            </th>
                            <th
                                scope="col"
                                class="px-4 py-3 text-right font-semibold text-[#1C1C1A]"
                            >
                                Qty
                            </th>
                            <th
                                scope="col"
                                class="px-4 py-3 text-right font-semibold text-[#1C1C1A]"
                            >
                                Unit
                            </th>
                            <th
                                scope="col"
                                class="px-4 py-3 text-right font-semibold text-[#1C1C1A]"
                            >
                                Total
                            </th>
                            <th scope="col" class="sr-only px-4 py-3">Remove</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#F5F5F5]">
                        <tr
                            v-for="item in store.items"
                            :key="item.part.id"
                            class="hover:bg-[#F5F5F5]"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <img
                                        :src="item.part.image"
                                        :alt="item.part.name"
                                        class="size-12 shrink-0 rounded object-cover"
                                    />
                                    <div>
                                        <NuxtLink
                                            :to="`/parts/${item.part.id}`"
                                            class="font-medium text-[#1C1C1A] hover:text-[#1DA05E]"
                                        >
                                            {{ item.part.name }}
                                        </NuxtLink>
                                        <p class="text-xs text-[#B5B5B5]">
                                            OEM: {{ item.part.oem }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="hidden px-4 py-3 text-[#1C1C1A] md:table-cell">
                                {{ item.part.brand }}
                            </td>
                            <td class="hidden px-4 py-3 md:table-cell">
                                <UBadge
                                    :variant="
                                        item.part.condition === 'new'
                                            ? 'success'
                                            : item.part.condition === 'used'
                                              ? 'warning'
                                              : 'info'
                                    "
                                >
                                    {{ item.part.condition }}
                                </UBadge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div
                                    class="ml-auto flex w-24 items-center justify-end rounded border border-[#B5B5B5]"
                                    role="group"
                                    :aria-label="`Quantity for ${item.part.name}`"
                                >
                                    <button
                                        class="px-2 py-1 text-[#1C1C1A] hover:bg-[#F5F5F5] disabled:opacity-40"
                                        aria-label="Decrease quantity"
                                        :disabled="item.quantity <= 1"
                                        @click="
                                            store.updateQuantity(item.part.id, item.quantity - 1)
                                        "
                                    >
                                        −
                                    </button>
                                    <span class="w-8 text-center">{{ item.quantity }}</span>
                                    <button
                                        class="px-2 py-1 text-[#1C1C1A] hover:bg-[#F5F5F5]"
                                        aria-label="Increase quantity"
                                        @click="
                                            store.updateQuantity(item.part.id, item.quantity + 1)
                                        "
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-right text-[#1C1C1A]">
                                €{{ item.part.price.toFixed(2) }}
                            </td>
                            <td class="px-4 py-3 text-right font-semibold text-[#1C1C1A]">
                                €{{ (item.part.price * item.quantity).toFixed(2) }}
                            </td>
                            <td class="px-4 py-3">
                                <button
                                    class="rounded p-1.5 text-[#B5B5B5] hover:bg-red-50 hover:text-red-600"
                                    :aria-label="`Remove ${item.part.name} from quote`"
                                    @click="store.removeItem(item.part.id)"
                                >
                                    <svg
                                        class="size-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot class="border-t border-[#B5B5B5] bg-[#F5F5F5]">
                        <tr>
                            <td
                                colspan="5"
                                class="px-4 py-3 text-right font-semibold text-[#1C1C1A]"
                            >
                                Grand Total
                            </td>
                            <td class="px-4 py-3 text-right text-lg font-bold text-[#1C1C1A]">
                                €{{ store.totalPrice.toFixed(2) }}
                            </td>
                            <td />
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <UButton variant="danger" size="sm" @click="showClearModal = true">
                    Clear All
                </UButton>
                <div class="flex gap-2">
                    <QuoteExportPdf />
                    <NuxtLink
                        to="/"
                        class="rounded-lg border border-[#B5B5B5] px-4 py-2 text-sm font-medium text-[#1C1C1A] hover:bg-[#F5F5F5]"
                    >
                        Add More Parts
                    </NuxtLink>
                </div>
            </div>
        </template>

        <UModal :open="showClearModal" title="Clear Quote" @close="showClearModal = false">
            <p class="text-[#1C1C1A]">
                Are you sure you want to remove all items from your quote? This cannot be undone.
            </p>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton variant="ghost" @click="showClearModal = false">Cancel</UButton>
                    <UButton variant="danger" @click="confirmClear">Clear All</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
