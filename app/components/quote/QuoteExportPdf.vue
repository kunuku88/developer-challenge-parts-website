<script setup lang="ts">
const store = useQuoteStore()
const authStore = useAuthStore()

function exportPdf() {
    // Dynamically import jsPDF to avoid SSR issues
    import('jspdf').then(({ jsPDF }) => {
        import('jspdf-autotable').then(({ default: autoTable }) => {
            const doc = new jsPDF()
            const date = new Date().toLocaleDateString('en-GB')

            // Header
            doc.setFontSize(18)
            doc.setTextColor(29, 160, 94) // #1DA05E
            doc.text('BAS World Parts', 14, 20)
            doc.setFontSize(10)
            doc.setTextColor(100)
            doc.text(`Quote generated: ${date}`, 14, 28)
            if (authStore.user) {
                doc.text(`Prepared for: ${authStore.user.name}`, 14, 33)
            }

            // Table
            autoTable(doc, {
                startY: 40,
                head: [
                    ['Part Name', 'OEM', 'Brand', 'Condition', 'Qty', 'Unit Price', 'Line Total'],
                ],
                body: store.items.map(
                    (item: {
                        part: {
                            name: string
                            oem: string
                            brand: string
                            condition: string
                            price: number
                        }
                        quantity: number
                    }) => [
                        item.part.name,
                        item.part.oem,
                        item.part.brand,
                        item.part.condition,
                        item.quantity,
                        `€${item.part.price.toFixed(2)}`,
                        `€${(item.part.price * item.quantity).toFixed(2)}`,
                    ],
                ),
                foot: [['', '', '', '', '', 'Grand Total', `€${store.totalPrice.toFixed(2)}`]],
                headStyles: { fillColor: [29, 78, 216] },
                footStyles: {
                    fillColor: [241, 245, 249],
                    textColor: [15, 23, 42],
                    fontStyle: 'bold',
                },
            })

            const fileName = `bas-world-quote-${date.replace(/\//g, '-')}.pdf`
            doc.save(fileName)
        })
    })
}
</script>

<template>
    <UButton
        variant="outline"
        size="sm"
        :disabled="!store.items.length"
        aria-label="Export quote as PDF"
        @click="exportPdf"
    >
        📄 PDF
    </UButton>
</template>
