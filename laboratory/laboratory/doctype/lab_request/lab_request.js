// Copyright (c) 2025, kajal and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lab Request", {
    refresh(frm) {
        if (!frm.is_new() && frm.doc.docstatus === 0) {
            frm.add_custom_button("Create Sample Tests", () => create_sample_tests_once(frm));
        }
    }
});

function create_sample_tests_once(frm) {
    const selected_tests = frm.doc.tests?.filter(t => t.selected == 1) || [];

    if (selected_tests.length === 0) {
        frappe.msgprint("Please select at least one test before creating Sample Tests.");
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
                frappe.set_route("List", "Sample Test");
            } else {
                create_sample_tests_and_result(frm, selected_tests);
            }
        }
    });
}

async function create_sample_tests_and_result(frm, selected_tests) {

    let created = 0;
    const total = selected_tests.length;
    let first_sample_test = null;

    for (let test_item of selected_tests) {

        await frappe.call({
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
                    test: test_item.lab_test || "",    // Use test name from tests table
                    sale_price: test_item.sale_price || ""
                }
            },
            callback: function (r) {

                created++;

                if (!first_sample_test) {
                    first_sample_test = r.message.name;
                }

                if (created === total) {
                    create_lab_test_result(frm, first_sample_test);
                }
            }
        });

    }
}
