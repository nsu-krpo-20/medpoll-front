import { Navigate, useNavigate } from '@solidjs/router';
import { createSignal, For , Show} from 'solid-js'
import { logout, user } from 'src/libs/user';
import { Avatar, IconButton, Menu, MenuItem, Divider, Typography } from "@suid/material";
import QRCodeView from "./QRcodeView"
import Logout from "@suid/icons-material/Logout";
import QrCodeIcon from "@suid/icons-material/QrCode";
import './TopBar.css'
import { Person } from '@suid/icons-material';

function UserDisplay() {
	const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
	const navigate = useNavigate();
	const open = () => Boolean(anchorEl());
	const handleClose = () => setAnchorEl(null);

	const userActions = [
		{
			name: "Пациенты",
			icon: <Person fontSize="small" class="mr-1"/>,
			props: { sx: {px: 1} },
			onClick: () => {
				return navigate("/patients")
			}
		}, {
			name: "Выход",
			icon: <Logout fontSize="small" class="mr-1"/>,
			props: { sx: {px: 1} },
			onClick: () => {
				logout();
			}
		},
	]

	return (<>
		<IconButton
			sx={{mr: 2, ml: "auto"}}
			onClick={(event) => setAnchorEl(event.currentTarget)}
			aria-haspopup="true"
			aria-expanded={open() ? "true" : undefined}
			aria-controls={open() ? "account-menu" : undefined}
			class="userDisplay flex items-center justify-end ml-auto mr-2">
				<Avatar class="" sx={{width: 32, height: 32}}/>
		</IconButton>

		<Menu
        anchorEl={anchorEl()}
        id="account-menu"
        open={open()}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 3px rgba(0,0,0,0.5))",
            mt: 1,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
		<Typography variant="body1" sx={{pl: 1, pr:2}}> Имя Именович </Typography>
		<Divider />
		<For each={userActions}>
			{(itm, i) => <MenuItem onClick={itm.onClick} {...(itm.props ? itm.props : {})}>
				{itm.icon} {itm.name}
			</MenuItem>}
		</For>
	  </Menu>
		
	</>)
}

function LoginButton() {
	const navigate = useNavigate();

	return (
		<button class="loginButton flex h-full w-fit px-4 ml-auto mr-2"
			onClick={() => navigate("/login")}>
			Вход
		</button>
	)
}

export default function TopBar() {
	return (<header class="topbar h-full">
		<h1> MedPoll </h1>
		{ user() ? <UserDisplay /> : <LoginButton /> }
	</header>)
}
