import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'

export function HeaderLinkMenu({ title, href }: { title: string, href: string }) {
  return (
    <Button href={href} color="inherit">
      {title}
    </Button>
  )
}

export function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            しゃべりんだべりん
          </Typography>
          <HeaderLinkMenu title="ログイン" href="/login" />
          <HeaderLinkMenu title="ログアウト" href="/logout" />
          <HeaderLinkMenu title="新規登録" href="/signup" />
        </Toolbar>
      </AppBar>
    </Box>

  )
}
