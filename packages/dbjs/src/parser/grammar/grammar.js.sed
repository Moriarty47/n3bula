/^declare var/d
s/(lexer.has("\([^"]*\)") ? {type: "\1"} : \1)/{type: "\1"}/g
s/^\(type NearleySymbol =\)/\1 { type: any } |/