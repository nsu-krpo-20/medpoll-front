import { useNavigate } from '@solidjs/router';
import { createSignal, For } from 'solid-js'
import { useUserContext } from 'src/libs/auth';
import { Avatar, IconButton, Menu, MenuItem, Divider, Typography } from "@suid/material";
import Logout from "@suid/icons-material/Logout";
import './TopBar.css'

const userActions = [
	{name: "Выйти", icon: <Logout fontSize="small" class="mr-1"/>},
]

function UserDisplay() {
	const { user } = useUserContext();
	const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
	const open = () => Boolean(anchorEl());
	const handleClose = () => setAnchorEl(null);

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
			{(itm, i) => <MenuItem>
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

function TopBar() {
	const { user } = useUserContext();

  return ( <>
      <header class="topbar h-full">
		<h1> MedPoll </h1>
		{ user() ? <UserDisplay /> : <LoginButton /> }
	  </header>
    </> )
}

export default TopBar;
