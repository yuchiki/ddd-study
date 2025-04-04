import { AppBar, Link, MenuItem, Toolbar, Typography } from "@mui/material"

export function HeaderLinkMenu({title, href}:{title:string, href:string}) {
  return (
    <MenuItem>
      <Link href={href}>
        <Typography>{title}</Typography >
      </Link>
    </MenuItem>
  )

}

export function Header() {
  return (
  <AppBar>
  <Toolbar>
    <Typography variant='h1'>   Header </Typography>

    <HeaderLinkMenu title="ログイン" href="/login" />
    <HeaderLinkMenu title="ログアウト" href="/logout" />
    <HeaderLinkMenu title="新規登録" href="/signup" />
  </Toolbar>
</AppBar>
  )
}
