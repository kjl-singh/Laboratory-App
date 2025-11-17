frappe.ui.form.on("Lab Request", {

    tests_add(frm, cdt, cdn) {
        update_lines_table(frm);
    },

    tests_remove(frm) {
        update_lines_table(frm);
    },

    tests(frm) {
        update_lines_table(frm);
    }
});

function update_lines_table(frm) {

    if (!frm.doc.tests) return;

    frm.clear_table("lines");

    const selected = frm.doc.tests.filter(row => row.selected == 1 && row.lab_test);

    if (selected.length === 0) {
        frm.refresh_field("lines");
        return;
    }

    selected.forEach(row => {

        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Lab Test",
                name: row.lab_test
            },
            callback: function (res) {

                if (!res.message) return;

                const test = res.message;

                const child = frm.add_child("lines");
                child.test = test.service || test.name;
                child.turnaround_time = test.turnaround_time || "";
                child.sale_price = test.price || 0;
                child.special_instruction = test.special_instruction || "";

                frm.refresh_field("lines");
            }
        });
    });
}
