$(document).ready(function() {
  $('#settings').submit(function(event){
    event.preventDefault()
    if($('select[name=color1]').val() != $('select[name=color2]').val() && $('#player').val() != $('#player2').val() && $('#player').val() != '' && $('#player2').val() != ''){
      const puissance4 = new Puissance4('#puissance4')
      $('#container').hide()
      $('#status').show()
      $('#puissance4').show()
      $('#again').show()
      $('#back').show()

      $('#again').click(function(){
        puissance4.again()
      })

      $('#back').click(function(){
        $('#status').hide()
        $('#puissance4').hide()
    		$('#container').show()
    		$('#row').val('')
    	  $('#column').val('')
    		$('#player').val('')
    	  $('#player2').val('')
        $('#again').hide()
        $('#back').hide()
      })
    }
  })
})
