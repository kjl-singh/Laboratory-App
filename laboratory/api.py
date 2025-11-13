import frappe

@frappe.whitelist()
def create_invoice_from_lab_request(lab_request):
    lab = frappe.get_doc("Lab Request", lab_request)

    invoice = frappe.new_doc("Sales Invoice")
    if hasattr(lab, "patient") and lab.patient:
        invoice.customer = lab.patient

    invoice.custom_lab_request = lab_request  

    if hasattr(lab, "lines") and lab.lines:
        for item in lab.lines:
            invoice.append("items", {
                "item_name": item.test,
                "qty": item.qty or 1,
                "rate": item.sale_price or 0,
                "income_account": "Sales - K"
            })
    else:
        frappe.throw("No lab request lines found. Please add medicines before creating an invoice.")

    invoice.set_missing_values()
    invoice.calculate_taxes_and_totals()

    invoice.base_write_off_amount = invoice.base_write_off_amount or 0
    invoice.base_grand_total = invoice.base_grand_total or 0
    invoice.grand_total = invoice.grand_total or 0

    invoice.insert(ignore_permissions=True)
    frappe.db.commit()

    return invoice.name

