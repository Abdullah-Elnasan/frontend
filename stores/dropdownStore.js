import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdownStore', () => {
    const isOpen = ref(false)

    function toggle() {
        isOpen.value = !isOpen.value
    }

    return { isOpen, toggle }
})
