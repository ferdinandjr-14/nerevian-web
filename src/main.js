import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

import "primeicons/primeicons.css"
import PrimeVue from "primevue/config"
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
import ConfirmPopup from "primevue/confirmpopup"

import "./style.css"

const app = createApp(App)

app.use(PrimeVue, {
    unstyled: true,
    pt: {
        accordioncontent: {
            transition: {
                enterFromClass: "opacity-0 -translate-y-1",
                enterActiveClass: "transition-all duration-300 ease-out overflow-hidden",
                enterToClass: "opacity-100 translate-y-0",
                leaveFromClass: "opacity-100 translate-y-0",
                leaveActiveClass: "transition-all duration-300 ease-in overflow-hidden",
                leaveToClass: "opacity-0 -translate-y-1",
            },
        },
        dialog: {
            transition: {
                enterFromClass: "opacity-0 scale-95",
                enterActiveClass: "transition-all duration-300 ease-out",
                enterToClass: "opacity-100 scale-100",
                leaveFromClass: "opacity-100 scale-100",
                leaveActiveClass: "transition-all duration-200 ease-in",
                leaveToClass: "opacity-0 scale-95",
            },
        },
        tooltip: {
            transition: {
                enterFromClass: "opacity-0",
                enterActiveClass: "transition-opacity duration-200 ease-out",
                enterToClass: "opacity-100",
                leaveFromClass: "opacity-100",
                leaveActiveClass: "transition-opacity duration-150 ease-in",
                leaveToClass: "opacity-0",
            },
        },
        select: {
            transition: {
                enterFromClass: "opacity-0",
                enterActiveClass: "transition-all duration-300 ease-in-out",
                enterToClass: "opacity-100",
                leaveFromClass: "opacity-100",
                leaveActiveClass: "transition-all duration-300 ease-in-out",
                leaveToClass: "opacity-0",
            },
        },
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
app.component("ConfirmPopup", ConfirmPopup)

app.use(router)

app.mount("#app")
