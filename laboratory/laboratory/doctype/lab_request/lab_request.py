# Copyright (c) 2025, kajal
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today

class LabRequest(Document):

    def after_insert(self):

        existing = {t.lab_test for t in self.tests} if self.tests else set()

        lab_tests = frappe.get_all("Lab Test", pluck="name")
        for test in lab_tests:
            if test not in existing:
                self.append("tests", {
                    "lab_test": test,
                    "selected": 0
                })

        self.save()

    def before_insert(self):
        if self.patient and not self.date:
            self.date = today()

    def autoname(self):
        prefix = "LR-"
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
