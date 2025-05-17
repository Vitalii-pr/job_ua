// components/RecommendationDialog.tsx
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState } from 'react'

export default function RecommendationDialog({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-bold">Нова рекомендація</DialogTitle>
          <Description className="text-sm text-gray-600">Введіть деталі, щоб надіслати запит</Description>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Ім'я</label>
              <input type="text" placeholder="Введіть ім'я" className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" placeholder="Введіть email" className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Повідомлення</label>
              <textarea placeholder="Повідомлення для рекомендації" className="w-full rounded border px-3 py-2" />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500">
                Скасувати
              </button>
              <button type="submit" className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                Надіслати
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
