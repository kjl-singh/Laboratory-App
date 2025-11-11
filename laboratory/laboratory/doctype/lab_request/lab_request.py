# Copyright (c) 2025, kajal and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today

class LabRequest(Document):
	def before_insert(self):
		if self.patient and not self.date:
			self.date = today()
