function f
    set -l foo 5
    echo "foo $foo"
end

foo --bar --ack

foo && bar (ack | quux zux)
foo @@@
bar
