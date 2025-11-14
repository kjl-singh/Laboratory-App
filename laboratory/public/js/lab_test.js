frappe.ui.form.on("Lab Request", {
    refresh(frm) {
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button("Create Test Results", () => create_test_results(frm));
        }
    }
});

function create_test_results(frm) {

    const selected_tests = frm.doc.tests?.filter(t => t.selected == 1).map(t => t.lab_test) || [];

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Sample Test",
            filters: { lab_request: frm.doc.name },
            fields: ["name", "test", "patient"]
        },
        callback(res) {

            if (!res.message || res.message.length === 0) {
                frappe.msgprint("No Sample Tests found for this Lab Request.");
                return;
            }

            const filtered_samples = res.message.filter(s => selected_tests.includes(s.test));

            if (filtered_samples.length === 0) {
                frappe.msgprint("No Sample Tests match the selected tests.");
                return;
            }

            filtered_samples.forEach(sample => {

                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: "Lab Test",
                        name: sample.test,
                        fields: ["*"]
                    },
                    callback(testDoc) {

                        if (!testDoc.message) {
                            frappe.msgprint(`Test template not found for: ${sample.test}`);
                            return;
                        }

                        let template = testDoc.message;

                        let diagnosis_rows = [];
                        if (template.parameter) {
                            template.parameter.forEach(row => {
                                diagnosis_rows.push({
                                    parameter: row.parameter,
                                    normal_range: row.normal_range,
                                    uom: row.uom,
                                    result_value_type: row.result_value_type
                                });
                            });
                        }

                        let consumed_rows = [];
                        if (template.productservice) {
                            template.productservice.forEach(row => {
                                consumed_rows.push({
                                   productservice: row.productservice,
                                   quantity: row.quantity
                                });
                            });
                        }

                        frappe.call({
                            method: "frappe.client.insert",
                            args: {
                                doc: {
                                    doctype: "Lab Test Result",
                                    patient: sample.patient,
                                    test: sample.test,
                                    test_sample: sample.name,
                                    prescribing_doctor: frm.doc.prescribing_doctor,
                                    request_date: frm.doc.date,
                                    company: frm.doc.company,
                                    diagnosis: diagnosis_rows,
                                    consumed_material: consumed_rows
                                }
                            },
                            callback(r) {
                                frappe.msgprint(`Lab Test Result Created: ${r.message.name}`);
                                frappe.set_route("Form", "Lab Test Result", r.message.name);
                            }
                        });

                    }
                });

            });
        }
    });
}
