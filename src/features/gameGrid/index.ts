import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { Board, Coordinate } from '@/app/types';
import { INITIAL_BOARD } from '@/algorithms/const';
import { convertToBoard } from '@/algorithms/common';

interface GameGridState {
    board: Board;
    solution: Board;
    selectedValue?: number;
    selectedCell?: Coordinate;
    hintCell?: Coordinate;
    checkMode: boolean;
}

const initialState: GameGridState = {
    board: convertToBoard(INITIAL_BOARD),
    solution: convertToBoard(INITIAL_BOARD),
    checkMode: false,
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
        setSelectedValue: (state, action: PayloadAction<number | undefined>) => {
            state.selectedValue = action.payload;
        },
        setSelectedCell: (state, action: PayloadAction<Coordinate | undefined>) => {
            state.selectedCell = action.payload;
        },
        setHintCell: (state, action: PayloadAction<Coordinate | undefined>) => {
            state.hintCell = action.payload;
        },
        setCheckMode: (state, action: PayloadAction<boolean>) => {
            state.checkMode = action.payload;
        },
        restartGame: state => {
            for (let i = 0; i < state.board.length; i++) {
                for (let j = 0; j < state.board.length; j++) {
                    if (!state.board[i][j].clue) {
                        state.board[i][j].val = 0;
                    }
                }
            }

            state.selectedCell = undefined;
            state.checkMode = false;
        },
        updateSelectedBoardCell: (state, action: PayloadAction<number>) => {
            if (!state.selectedCell) {
                return;
            }

            const val = action.payload;
            const [r, c] = state.selectedCell;
            state.board[r][c].val = val;
        },
    },
});

export const {
    setBoard,
    setSolution,
    setSelectedValue,
    setSelectedCell,
    setHintCell,
    setCheckMode,
    restartGame,
    updateSelectedBoardCell,
} = gameGridSlice.actions;

export default gameGridSlice.reducer;
