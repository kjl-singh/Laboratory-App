frappe.ui.form.on("Lab Request Test", {
    lab_test(frm, cdt, cdn) {
        update_line(frm, cdt, cdn);
    },
    selected(frm, cdt, cdn) {
        update_line(frm, cdt, cdn);
    }
});

function update_line(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    let line = frm.doc.lines.find(l => l.test_sample == row.name);

    if (row.selected && row.lab_test) {
        frappe.db.get_doc("Lab Test", row.lab_test).then(testDoc => {
            if (!testDoc) return;

            if (!line) {
                line = frm.add_child("lines");
                line.test_sample = row.name; 
            }

            line.test = testDoc.name; 
            line.test_name = testDoc.service || testDoc.name;
            line.turnaround_time = testDoc.turnaround_time || "";
            line.sale_price = testDoc.price || 0;
            line.special_instruction = testDoc.special_instruction || "";

            frm.refresh_field("lines");
        });
    } else {
        if (line) {
            const index = frm.doc.lines.indexOf(line);
            if (index !== -1) frm.doc.lines.splice(index, 1);
            frm.refresh_field("lines");
        }
    }
}
