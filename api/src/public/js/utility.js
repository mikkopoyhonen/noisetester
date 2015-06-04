function ajaxRequest(method, url, formid){
      $.ajax({
      type: method,
      contentType: "application/json",
      url: url,
      data: JSON.stringify(getFormData($("#"+formid))),
      dataType: "json",
      beforeSend: function(){
        $("#status").removeClass();
      }
      })
        .done(function(data) {
          $("#status").addClass('alert alert-success');
          $("#status").text("Response: " + data).show();
         })
        .fail(function(xhr) {
          $("#status").addClass('alert alert-danger');
          $("#status").text("Response: " + xhr.responseText).show();
        });
    }

function getFormData($form){
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};
          $.map(unindexed_array, function(n, i){
           indexed_array[n['name']] = n['value'];
         });
        return indexed_array;
      }
