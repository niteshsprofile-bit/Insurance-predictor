import socket

from auth import _friendly_supabase_error


def test_supabase_dns_error_message_is_clear():
    err = socket.gaierror(11001, 'getaddrinfo failed')
    msg = _friendly_supabase_error(err)
    assert 'Supabase project is unavailable' in msg
    assert 'backend/.env' in msg
