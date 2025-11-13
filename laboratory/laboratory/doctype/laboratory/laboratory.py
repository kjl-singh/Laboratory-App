# Copyright (c) 2025, kajal and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today
from frappe.model.naming import getseries



class Laboratory(Document):
	def before_insert(self):
		if self.patient and not self.date:
			self.date = today()