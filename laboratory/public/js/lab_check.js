frappe.ui.form.on("Lab Request", {
  test_group(frm) {
    if (!frm.doc.test_group) {
      frappe.msgprint("Please select a Test Group first.");
      return;
    }

    frappe.db.get_doc("Laboratory Group", frm.doc.test_group).then(doc => {
      if (doc.lab_test_group && doc.lab_test_group.length > 0) {
        let d = new frappe.ui.Dialog({
          title: "Select Tests",
          fields: [
            {
              fieldname: "tests_html",
              fieldtype: "HTML",
              label: "Tests"
            }
          ],
          primary_action_label: "Save Selection",
          primary_action(values) {
            let selected_tests = [];
            d.$wrapper.find(".test-checkbox:checked").each(function() {
              selected_tests.push($(this).data("test"));
            });

            frappe.msgprint("Selected Tests: " + selected_tests.join(", "));
            d.hide();
          }
        });

        let html = `<div style="margin-top:10px;">`;
        doc.lab_test_group.forEach(row => {
          html += `
            <div style="margin:5px 0;">
              <input type="checkbox" class="test-checkbox" data-test="${row.test}" id="${row.test}">
              <label for="${row.test}" style="margin-left:5px;">${row.test}</label>
            </div>`;
        });
        html += `</div>`;
        d.fields_dict.tests_html.$wrapper.html(html);
        d.show();

      } else {
        frappe.msgprint("No tests found in selected Laboratory Group.");
      }
    });
  }
});
