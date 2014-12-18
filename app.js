(function() {
  return {

    events: {
      'remoteGetOrderRequest.done': 'this.displayInfo',
      'remoteGetOrderRequest.fail': 'this.showError',  
      'app.activated':'getInfo'
    },
    
    requests: {
      
      remoteGetOrderRequest: function(order_number,token) {
        console.log(token);
        var url='http://luxuryperfume.arkhitech.com/api/orders/'+order_number +'?token='+token+'';
        console.log(url);
        return {
          url: 'http://luxuryperfume.arkhitech.com/api/orders/'+order_number +'?token='+token+'',
          type:'GET',
          dataType: 'json'
        };
      },
      
      remoteGetUserRequest: function(id,token) {
        return {
          url: 'http://luxuryperfume.arkhitech.com/api/users/'+ id +'?token='+token+'',
          type:'GET',
          dataType: 'json'
        };
      }
      

    },
    
    
    
    formatDates: function(data) {
      var cdate = new Date(data.user_customer_since);
      data.user.created_at = cdate.toLocaleDateString();
      return data;
    },
    getInfo: function() {
      var token=this.setting('token');
      console.log(token);
      var order_number=this.ticket().customField('custom_field_24150096');
      console.log("order_number:"+order_number);
      this.ajax('remoteGetOrderRequest', order_number,token);
    },
    
    
    showError: function() {
      this.switchTo('error');
    },
    
    displayInfo: function(data)
    {
      var token=this.setting('token');
      console.log(data);
      var customer_id=this.ticket().customField('custom_field_24102143');
      console.log(customer_id);
      this.ajax('remoteGetUserRequest', customer_id,token).then(

          function(user_data) {
            data.user_bill_address=user_data.bill_address;
            data.user_ship_address=user_data.ship_address;
            data.user_customer_since=user_data.created_at;
            data.user_email=user_data.email;
//            this.formatDates(data);
            this.switchTo('order_details',data);
          },

          function() {
            this.showError();
          }

        );
      
         
    }

  };
}());