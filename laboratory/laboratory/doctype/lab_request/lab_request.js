// Copyright (c) 2025, kajal and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lab Request", {
    refresh(frm) {
        if (!frm.is_new()) {
            frm.add_custom_button("Create Sample Tests", () => create_sample_tests_once(frm));
        }
    }
});

function create_sample_tests_once(frm) {
    if (!frm.doc.lines || frm.doc.lines.length === 0) {
        frappe.msgprint("No test lines found in this Lab Request.");
        return;
    }

    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Sample Test",
            filters: { lab_request: frm.doc.name },
            fieldname: "name"
        },
        callback: function (res) {
            if (res.message && res.message.name) {
                frappe.msgprint("Sample Tests already exist for this Lab Request.");
                frappe.set_route("List", "Sample Test");
            } else {
                let created = 0;
                const total = frm.doc.lines.length;

                frm.doc.lines.forEach(line => {
                    frappe.call({
                        method: "frappe.client.insert",
                        args: {
                            doc: {
                                doctype: "Sample Test",
                                patient: frm.doc.patient,
                                age: frm.doc.age,
                                company: frm.doc.company,
                                prescribing_doctor: frm.doc.prescribing_doctor,
                                collection_type: frm.doc.collection_type,
                                sample_type: frm.doc.sample_type,
                                date: frm.doc.date,
                                lab_request: frm.doc.name,
                                test: line.test || "",
                                sale_price: line.sale_price || ""
                            }
                        },
                        callback: function () {
                            created++;
                            if (created === total) {
                                frappe.set_route("List", "Sample Test");
                            }
                        }
                    });
                });
            }
        }
    });
}
