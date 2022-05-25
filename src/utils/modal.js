import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { useState } from "react";

const ModalImg = (img) => {
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(false);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            {/* <div>
                <button onClick={handleOpen}>ABRIR MODAL</button>
            </div> */}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {/* <strong>Editar: {product.nomeprod}</strong> */}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                   <img src={img} alt='img-load-error'></img>
                </Typography>
            </Box>
        </Modal >
    </div >
    );
};

export default ModalImg;