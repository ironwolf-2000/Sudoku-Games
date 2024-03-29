import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

import { GRID_SIZES, MINIMUM_CLUE_COUNT, SUDOKU_TYPES, sudokuTypeToLabel } from '@/app/const';
import styles from './MainPage.module.scss';
import { Icon, Slider } from '@/components';
import check from '@/assets/icons/check.svg';
import hint from '@/assets/icons/hint.svg';
import notes from '@/assets/icons/notes.svg';
import notesOutline from '@/assets/icons/notes_outline.svg';
import { RootState } from '@/app';
import {
    incrementInitialCheckCount,
    incrementInitialHintCount,
    setGridSize,
    setInitialClueCount,
    setSudokuType,
    toggleInitialWithNotes,
} from '@/features/mainSetup';
import { ISliderProps } from '@/components/Slider/types';
import { NumberInput, PlayButton } from './components';

export const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const { initialCheckCount, initialHintCount, initialWithNotes, initialClueCount, sudokuType, gridSize } =
        useSelector((state: RootState) => state.mainSetup);

    const sudokuTypes: ISliderProps['items'] = useMemo(() => {
        return SUDOKU_TYPES.map(type => ({
            label: sudokuTypeToLabel[type],
            onItemClick: () => dispatch(setSudokuType(type)),
        }));
    }, [dispatch]);

    const gridSizes: ISliderProps['items'] = useMemo(() => {
        return GRID_SIZES.map(size => ({
            label: `${size}×${size}`,
            onItemClick: () => dispatch(setGridSize(size)),
        }));
    }, [dispatch]);

    const helpIcons = useMemo(
        () => [
            {
                src: check,
                badge: String(initialCheckCount),
                label: 'checks',
                onClick: () => dispatch(incrementInitialCheckCount()),
            },
            {
                src: hint,
                badge: String(initialHintCount),
                label: 'hints',
                onClick: () => dispatch(incrementInitialHintCount()),
            },
            {
                src: initialWithNotes ? notes : notesOutline,
                badge: String(initialWithNotes ? 'on' : 'off'),
                label: 'notes',
                onClick: () => dispatch(toggleInitialWithNotes()),
            },
        ],
        [dispatch, initialCheckCount, initialHintCount, initialWithNotes]
    );

    return (
        <div className={styles.MainPage}>
            <h1 className={styles.Title}>Sudoku Games</h1>
            <main className={styles.Body}>
                <section className={styles.Section}>
                    <h2 className={styles.SectionTitle}>Game Mode</h2>
                    <Slider
                        items={sudokuTypes}
                        sliderItemClass={styles.GameModeItem}
                        selectedIndex={SUDOKU_TYPES.indexOf(sudokuType)}
                    />
                </section>
                <section className={styles.Section}>
                    <h2 className={styles.SectionTitle}>Grid Size</h2>
                    <Slider
                        items={gridSizes}
                        sliderItemClass={styles.GridSizeItem}
                        selectedIndex={GRID_SIZES.indexOf(gridSize)}
                    />
                </section>
                <section className={classnames(styles.Section, styles.horizontal)}>
                    <h2 className={styles.SectionTitle}>Help:</h2>
                    <div className={classnames(styles.SectionContent, styles.HelpContent)}>
                        {helpIcons.map(props => (
                            <Icon key={props.label} withCaption captionVisible {...props} />
                        ))}
                    </div>
                </section>
                <section className={classnames(styles.Section, styles.horizontal)}>
                    <h2 className={styles.SectionTitle}>Clues:</h2>
                    <div className={styles.SectionContent}>
                        <NumberInput
                            min={MINIMUM_CLUE_COUNT[sudokuType][gridSize]}
                            max={gridSize ** 2 - 1}
                            value={initialClueCount[sudokuType][gridSize]}
                            onChange={(value: number) => dispatch(setInitialClueCount({ sudokuType, gridSize, value }))}
                        />
                    </div>
                </section>
            </main>
            <PlayButton />
        </div>
    );
};
