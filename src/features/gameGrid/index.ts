import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Board, Coordinate } from '@/app/types';

interface GameGridState {
    board: Board;
    solution: Board;
    selectedValue?: number;
    selectedCell?: Coordinate;
    hintCell?: Coordinate;
}

const initialState: GameGridState = {
    board: [],
    solution: [],
};

export const gameGridSlice = createSlice({
    name: 'gameGrid',
    initialState,
    reducers: {
        setBoard: (state, action: PayloadAction<Board>) => {
            state.board = action.payload;
        },
        setSolution: (state, action: PayloadAction<Board>) => {
            state.solution = action.payload;
        },
        setSelectedValue: (state, action: PayloadAction<number>) => {
            state.selectedValue = action.payload;
        },
        resetSelectedValue: state => {
            state.selectedValue = undefined;
        },
        setSelectedCell: (state, action: PayloadAction<Coordinate>) => {
            state.selectedCell = action.payload;
        },
        resetSelectedCell: state => {
            state.selectedCell = undefined;
        },
        setHintCell: (state, action: PayloadAction<Coordinate>) => {
            state.hintCell = action.payload;
        },
        resetHintCell: state => {
            state.hintCell = undefined;
        },
        restartGame: state => {
            for (let i = 0; i < state.board.length; i++) {
                for (let j = 0; j < state.board.length; j++) {
                    if (!state.board[i][j].clue) {
                        state.board[i][j] = { val: 0, notes: [] };
                    }
                }
            }

            state.selectedCell = undefined;
        },
        clearBoardErrors: state => {
            for (let i = 0; i < state.board.length; i++) {
                for (let j = 0; j < state.board.length; j++) {
                    if (state.board[i][j].val && state.board[i][j].val !== state.solution[i][j].val) {
                        state.board[i][j] = { val: 0, notes: [] };
                    }
                }
            }
        },
        updateCellValue: (state, action: PayloadAction<number>) => {
            if (!state.selectedCell) {
                return;
            }

            const [r, c] = state.selectedCell;
            const val = action.payload;

            if (!state.board[r][c].clue) {
                state.board[r][c] = { val, notes: [] };
            }
        },
        updateCellNotes: (state, action: PayloadAction<number>) => {
            if (!state.selectedCell) {
                return;
            }

            const val = action.payload;
            const [r, c] = state.selectedCell;

            if (state.board[r][c].clue) {
                return;
            }

            const itemIndex = state.board[r][c].notes.indexOf(val);

            if (itemIndex === -1) {
                state.board[r][c].notes.push(val);
            } else {
                state.board[r][c].notes.splice(itemIndex, 1);
            }

            state.board[r][c].val = 0;
        },
    },
});

export const {
    setBoard,
    setSolution,
    setSelectedValue,
    resetSelectedValue,
    setSelectedCell,
    resetSelectedCell,
    setHintCell,
    resetHintCell,
    restartGame,
    clearBoardErrors,
    updateCellValue,
    updateCellNotes,
} = gameGridSlice.actions;

export default gameGridSlice.reducer;
