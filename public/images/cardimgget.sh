for (( i=1; i<53; i++ )); do
  curl http://www.afsgames.com/cardimg/$i.gif > $i.gif
done