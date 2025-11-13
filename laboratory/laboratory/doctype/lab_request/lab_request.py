# Copyright (c) 2025, kajal and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today

class LabRequest(Document):
    def before_insert(self):
        if self.patient and not self.date:
            self.date = today()

    def autoname(self):
        prefix = "LQ-"

        existing = frappe.get_all(self.doctype, pluck="name")

        numbers = []
        for n in existing:
            if n.startswith(prefix):
                try:
                    num = int(n.replace(prefix, ""))
                    numbers.append(num)
                except ValueError:
                    pass

        new_number = 1
        while new_number in numbers:
            new_number += 1

        self.name = f"{prefix}{new_number:03d}"
