frappe.ui.form.on('Lab Request', {
    refresh(frm) { 
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(__('Create Invoice'), function() {
                frappe.call({
                    method: "laboratory.api.create_invoice_from_lab_request",
                    args: { lab_request: frm.doc.name },
                    callback: function(r) {
                        if (!r.exc && r.message) {
                            frappe.msgprint(__('Invoice Created: ') + r.message);
                            frappe.set_route('Form', 'Sales Invoice', r.message);
                        } else {
                            frappe.msgprint(__('Error while creating invoice'));
                        }
                    }
                });
            }, __('Create'));
        }
    }
});
