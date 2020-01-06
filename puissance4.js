class Puissance4 {

	constructor(selector){
			this.rows = $('#row').val()
			this.columns = $('#column').val()
			$('#row').val('').blur()
			$('#column').val('').blur()
			this.player = $('#player').val()
			this.player2 = $('#player2').val()
			this.selector = selector
			this.endGame = false
			this.createGrid()
			this.evenement()
	}

	createGrid(){
		const $grid = $(this.selector)
		$grid.empty()
		this.endGame = false
		this.player = $('#player').val()
		this.player2 = $('#player2').val()
		if(this.rows === "" || this.rows < 5){
			this.rows = 6
		}if(this.rows > 10) {
			this.rows = 10
		}if(this.columns === "" || this.columns < 5) {
			this.columns = 7
		}if(this.columns > 22) {
			this.columns = 22
		}
		for(let row = 0; row < this.rows; row++){
			const $row = $('<div>').addClass('row')
			for(let column = 0; column < this.columns; column++){
				const $column = $('<div>').addClass('column empty').attr('data-column', column).attr('data-row', row)
				$row.append($column)
			}
			$grid.append($row)
		}
	}

	evenement(){
		const $grid = $(this.selector)
		const that = this
		$('#status').text("It's " + $('#player').val() + "'s turn")

		function findLastCellEmpty(column){
			const cells = $(`.column[data-column='${column}']`)
			for(let i = cells.length - 1; i >= 0; i--){
				const $cell = $(cells[i])
				if($cell.hasClass('empty')){
					return $cell
				}
			}
			return null
		}

		$grid.on('mouseenter', '.column.empty', function(){
			if(that.endGame) return
			const column = $(this).data('column')
			const $lastCellEmpty = findLastCellEmpty(column)
			if(that.player === $('#player').val()){
				$lastCellEmpty.addClass(`prev-` + $('select[name=color1]').val())
			}else {
				$lastCellEmpty.addClass(`prev-` + $('select[name=color2]').val())
			}
		})

		$grid.on('mouseleave', '.column', function(){
				$('.column').removeClass(`prev-${that.player}`)
				if(that.player === $('#player').val()){
					$('.column').removeClass(`prev-` + $('select[name=color1]').val())
				}else {
					$('.column').removeClass(`prev-` + $('select[name=color2]').val())
				}
		})

		$grid.on('click', '.column.empty', function(){
			if (that.endGame) return
			const column = $(this).data('column')
			const $lastCellEmpty = findLastCellEmpty(column)
			$lastCellEmpty.removeClass(`empty prev-${that.player}`)
			$lastCellEmpty.addClass(that.player)
			$lastCellEmpty.data('player', that.player)
			if(that.player === $('#player').val()){
				$lastCellEmpty.css('background-color', $('select[name=color1]').val())
				$('#status').text("It's " + $('#player2').val() + "'s turn")
			}else {
				$lastCellEmpty.css('background-color', $('select[name=color2]').val())
				$('#status').text("It's " + $('#player').val() + "'s turn")
			}

			const winner = that.verifyWinner($lastCellEmpty.data('row'), $lastCellEmpty.data('column'))
			if(winner){
				that.endGame = true
				$('.column.empty').attr('class', 'column')
				$('#status').text(that.player + " won!")
				return
			}

			that.player = (that.player === $('#player').val()) ? $('#player2').val() : $('#player').val()
			$(this).trigger('mouseenter')
		})
	}

	verifyWinner(row, column){
		const that = this

		function $getCell(x, y){
			return $(`.column[data-row='${x}'][data-column='${y}']`)
		}

		function verifyDirection(direction){
			let total = 0
			let x = row + direction.x
			let y = column + direction.y
			let $next = $getCell(x, y)
			while(x >= 0 && x < that.rows && y >= 0 && y < that.columns && $next.data('player') === that.player){
				total++
				x += direction.x
				y += direction.y
				$next = $getCell(x, y)
			}
			return total
		}

		function verifyVictory(directionA, directionB){
			const total = 1 + verifyDirection(directionA) + verifyDirection(directionB);
			if(total >= 4) {
				return that.player
			} else {
				return null
			}
		}

		function verifyVerticals(){
			return verifyVictory({x: -1, y: 0}, {x: 1, y: 0});
		}

		function verifyHorizontals() {
			return verifyVictory({x: 0, y: -1}, {x: 0, y: 1});
		}

		function verifyDiagonal1() {
			return verifyVictory({x: 1, y: -1}, {x: 1, y: 1});
		}

		function verifyDiagonal2() {
			return verifyVictory({x: 1, y: 1}, {x: -1, y: -1});
		}

		return verifyVerticals() || verifyHorizontals() || verifyDiagonal1() || verifyDiagonal2();
	}

	again(){
		this.createGrid()
		$('#status').text("It's " + $('#player').val() + "'s turn")
	}

}
