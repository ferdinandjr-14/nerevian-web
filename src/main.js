import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

import 'primeicons/primeicons.css'
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"
import ConfirmationService from "primevue/confirmationservice"

import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Select from "primevue/select"
import Textarea from "primevue/textarea"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import Dialog from "primevue/dialog"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import Tabs from "primevue/tabs"
import TabList from "primevue/tablist"
import Tab from "primevue/tab"
import TabPanels from "primevue/tabpanels"
import TabPanel from "primevue/tabpanel"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Card from "primevue/card"
import ConfirmDialog from "primevue/confirmdialog"

import "./style.css"

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
})
app.use(ConfirmationService)

app.component("Button", Button)
app.component("InputText", InputText)
app.component("Password", Password)
app.component("Select", Select)
app.component("Textarea", Textarea)
app.component("IconField", IconField)
app.component("InputIcon", InputIcon)
app.component("Dialog", Dialog)
app.component("Accordion", Accordion)
app.component("AccordionPanel", AccordionPanel)
app.component("AccordionHeader", AccordionHeader)
app.component("AccordionContent", AccordionContent)
app.component("Tabs", Tabs)
app.component("TabList", TabList)
app.component("Tab", Tab)
app.component("TabPanels", TabPanels)
app.component("TabPanel", TabPanel)
app.component("DataTable", DataTable)
app.component("Column", Column)
app.component("Card", Card)
app.component("ConfirmDialog", ConfirmDialog)

app.use(router)

app.mount("#app")
