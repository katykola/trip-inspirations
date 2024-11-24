import { Stack } from '@mui/material'; 
import TripTile from './TripTile';

export default function TripList(){
    return(
        <Stack>
            <TripTile/>
            <TripTile/>
            <TripTile/>
            <TripTile/>
        </Stack>
    )
}