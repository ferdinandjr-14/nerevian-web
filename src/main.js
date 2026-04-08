import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

import 'primeicons/primeicons.css'
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"

import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Dialog from "primevue/dialog"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Card from "primevue/card"

import "./style.css"

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
})

app.component("Button", Button)
app.component("InputText", InputText)
app.component("Dialog", Dialog)
app.component("Accordion", Accordion)
app.component("AccordionPanel", AccordionPanel)
app.component("AccordionHeader", AccordionHeader)
app.component("AccordionContent", AccordionContent)
app.component("DataTable", DataTable)
app.component("Column", Column)
app.component("Card", Card)

app.use(router)

app.mount("#app")
