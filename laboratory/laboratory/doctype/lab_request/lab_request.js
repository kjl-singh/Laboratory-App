// Copyright (c) 2025, kajal and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lab Request", {
  test_group(frm) {
    if (frm.doc.test_group) {
      frm.clear_table("lines");
      console.log("Selected Test Group:", frm.doc.test_group);

      frappe.db.get_doc("Laboratory Group", frm.doc.test_group).then(doc => {
        console.log("Fetched Laboratory Group doc:", doc);

        if (doc.lab_test_group && doc.lab_test_group.length > 0) {
          let i = 1;
          doc.lab_test_group.forEach(row => {
            console.log("Adding row:", row);

            let child = frm.add_child("lines");
            child.no = i++;
            child.test = row.test;
            child.turnaround_time = row.turnaround_time;
            child.sale_price = row.sale_price;
            child.special_instruction = row.special_instruction;
          });
          frm.refresh_field("lines");
        } else {
          frappe.msgprint("No tests found in selected Laboratory Group.");
          console.log("No lab_test_group found.");
        }
      });
    } else {
      frm.clear_table("lines");
      frm.refresh_field("lines");
    }
  }
});
